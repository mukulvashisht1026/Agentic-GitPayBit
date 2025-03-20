import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";



// const authenticateWithBackend = async (token: JWT) => {

// };
const primaryApiUrl = (process.env.NEXT_PUBLIC_API_URL_BACKEND || "https://gitbit-9138f8eb30be.herokuapp.com") + "/auth/github-login";

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
        console.log('assigning accessToken: ', account, token)

        token.accessToken = account.access_token; // Store GitHub access token
      }
      return token;
    },
    async session({ session, token }) {
      console.log('token_session123: ', session, token)
      try {
        // console.log('authenticateWithBackend jumbo: ', token, JSON.stringify({ token }))
        const response = await fetch(primaryApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token }),
        });
    
        const data = await response.json();
        if (data.jwtToken) {
          console.log('datayoyoyo123 is : ' , data)
          // setJwtToken(data.jwtToken);
          // setUsername(data.user.username);
          // localStorage.setItem("jwtToken", data.jwtToken);

          session.accessToken = token.accessToken as string; // Assign to session
          session.bAccessToken = data.jwtToken;
          


        }
      } catch (error) {
        console.error("Error authenticating with backend:", error);
      }




      // authenticateWithBackend(token)
      return session;
    },
  },
});
