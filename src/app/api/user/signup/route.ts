import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { connectToDatabase } from '../../../../lib/db'
import { signUpSchema } from '../../../../lib/validators'
import { User } from '../../../../models/User'
import { generateTokens } from '../../../../lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = signUpSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error },
        { status: 400 }
      )
    }

    const { email, password, name } = validation.data

    const { db } = await connectToDatabase()

    const existingUser = await db.collection<User>('users').findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser: User = {
      email,
      password: hashedPassword,
      name: name || '',
      provider: 'credentials',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection<User>('users').insertOne(newUser)
    const createdUser = await db.collection<User>('users').findOne({ _id: result.insertedId })

    if (!createdUser) {
      throw new Error('Failed to create user')
    }

    const { accessToken, refreshToken } = generateTokens(createdUser)

    await db.collection<User>('users').updateOne(
      { _id: result.insertedId },
      { 
        $set: { 
          refreshToken,
          refreshTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date()
        }
      }
    )

    const userResponse = {
      id: createdUser._id.toString(),
      email: createdUser.email,
      name: createdUser.name,
      provider: createdUser.provider,
      createdAt: createdUser.createdAt
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: userResponse,
      accessToken
    }, { 
      status: 201,
      headers: {
        'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}; Path=/`
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
