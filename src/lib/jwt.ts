import jwt from 'jsonwebtoken'
import { User } from '../models/User'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME || '7d'
const REFRESH_TOKEN_EXPIRE_TIME = process.env.REFRESH_TOKEN_EXPIRE_TIME || '30d'

export interface JWTPayload {
  userId: string
  email: string
  name?: string
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  userId: string
  tokenVersion: number
  iat?: number
  exp?: number
}

export function generateTokens(user: User) {
  const payload: JWTPayload = {
    userId: user._id?.toString() || user.id || '',
    email: user.email,
    name: user.name
  }

  const accessToken = jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRE_TIME 
  })

  const refreshTokenPayload: RefreshTokenPayload = {
    userId: user._id?.toString() || user.id || '',
    tokenVersion: 1
  }

  const refreshToken = jwt.sign(refreshTokenPayload, JWT_SECRET, { 
    expiresIn: REFRESH_TOKEN_EXPIRE_TIME 
  })

  return { accessToken, refreshToken }
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload
  } catch (error) {
    return null
  }
}
