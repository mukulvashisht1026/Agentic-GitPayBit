import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";



export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token; // Store GitHub access token
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string; // Assign to session
      return session;
    },
  },
});
