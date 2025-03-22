// pages/api/auth/[...nextauth].ts
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { JWT } from "next-auth/jwt";

import { generateJWT } from "@/lib/jwtUtils";
import UserModel, { IUser } from "@/models/User";
import { connectMongoClient } from "@/lib/db";

// Ensure MongoDB is connected only once
connectMongoClient();

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: any }) {
      if (account) {
        console.log("assigning accessToken:", account, token);
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      console.log("token_session123:", session, token);
      try {
        const { name, email } = token;
        console.log("123yaha aya 4");

        let user: IUser | null = await UserModel.findOne({ emailId: email }).exec();
        console.log("123yaha aya 5", user);

        if (!user) {
          console.log("creating new user...");
          user = new UserModel({
            emailId: email,
            githubId: email,
            username: name,
            totalCallAvailable: 10,
            totalCallsExec: 0,
            subscribed: false,
            subscriptionId: "",
          });

          await user.save();
        }

        const jwtToken = generateJWT({ email: user.emailId, githubId: user.githubId });

        if (jwtToken) {
          console.log("datayoyoyo123 is:", jwtToken);
          session.accessToken = token.accessToken as string;
          session.bAccessToken = jwtToken;
        }
      } catch (error) {
        console.error("Error authenticating with backend:", error);
      }

      return session;
    },
  },
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, authOptions);
}
