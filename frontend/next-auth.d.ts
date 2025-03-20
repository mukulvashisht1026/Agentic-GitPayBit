import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    bAccessToken?: string;
   

  }

  interface JWT {
    accessToken?: string;
  }
}
