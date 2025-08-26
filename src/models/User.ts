import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  id?: string;
  email: string;
  password?: string;
  name?: string;
  image?: string;
  provider?: "credentials" | "google";
  googleId?: string;
  emailVerified?: Date | null;
  refreshToken?: string;
  refreshTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  _id?: ObjectId;
  userId: ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  createdAt: Date;
  updatedAt: Date;
}
