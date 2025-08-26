import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { generateTokens, verifyRefreshToken } from "@/lib/jwt";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    const user = await db.collection<User>("users").findOne({
      _id: new ObjectId(decoded.userId),
      refreshToken: refreshToken,
      refreshTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    await db.collection<User>("users").updateOne(
      { _id: user._id },
      {
        $set: {
          refreshToken: newRefreshToken,
          refreshTokenExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json(
      { accessToken },
      {
        headers: {
          "Set-Cookie": `refreshToken=${newRefreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${
            30 * 24 * 60 * 60
          }; Path=/`,
        },
      }
    );
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
