import type { AuthOptions, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { connectToDatabase } from "./db";
import { User } from "@/models/User";
import { generateTokens } from "./jwt";
import { ObjectId } from "mongodb";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const { db } = await connectToDatabase();
          const user = await db.collection<User>("users").findOne({
            email: credentials.email,
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid credentials");
          }

          // Generate tokens
          const { refreshToken } = generateTokens(user);

          // Update user with refresh token
          await db.collection<User>("users").updateOne(
            { _id: user._id },
            {
              $set: {
                refreshToken,
                refreshTokenExpiry: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000
                ), // 30 days
                updatedAt: new Date(),
              },
            }
          );

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),

    // Google Provider (uncomment when ready to use)
    /*
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    */
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      // Handle Google OAuth
      if (account?.provider === "google") {
        try {
          const { db } = await connectToDatabase();

          // Check if user exists
          let dbUser = await db.collection<User>("users").findOne({
            email: token.email!,
          });

          if (!dbUser) {
            // Create new user for Google OAuth
            const newUser: User = {
              email: token.email!,
              name: token.name || "",
              image: token.picture || "",
              provider: "google",
              googleId: token.sub,
              emailVerified: new Date(),
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            const result = await db
              .collection<User>("users")
              .insertOne(newUser);
            dbUser = { ...newUser, _id: result.insertedId };
            token.userId = result.insertedId.toString();
          } else {
            // Update existing user
            await db.collection<User>("users").updateOne(
              { _id: new ObjectId(dbUser._id) },
              {
                $set: {
                  name: token.name || dbUser.name,
                  image: token.picture || dbUser.image,
                  googleId: token.sub,
                  updatedAt: new Date(),
                },
              }
            );
            token.userId = dbUser._id.toString();
          }

          // Store account information
          await db.collection("accounts").updateOne(
            {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
            {
              $set: {
                userId: new ObjectId(token.userId as string),
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
                updatedAt: new Date(),
              },
              $setOnInsert: {
                createdAt: new Date(),
              },
            },
            { upsert: true }
          );
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;

        // Fetch fresh user data
        try {
          const { db } = await connectToDatabase();
          const user = await db.collection<User>("users").findOne({
            _id: new ObjectId(token.userId as string),
          });

          if (user) {
            session.user.name = user.name || session.user.name;
            session.user.image = user.image || session.user.image;
            session.user.provider = user.provider || "credentials";
          }
        } catch (error) {
          console.error("Session callback error:", error);
        }
      }

      return session;
    },

    async signIn({ user, account, profile }) {
      // Allow sign in
      return true;
    },
  },

  pages: {
    signIn: "/signin",
    signOut: "/signin",
    error: "/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
