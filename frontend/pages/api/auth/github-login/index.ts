import { NextRequest, NextResponse } from "next/server";
// import { connectMongoClient } from "@/lib/db";
import { generateJWT } from "@/lib/jwtUtils";
import UserModel, { IUser } from "@/models/User";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;


export default async function POST(req: NextRequest) {
    const { token } = req.body;
    if (!token) {
        console.log('[github-login] internal servier error due to req.body')
        NextResponse.json({ error: "invalid token" }, { status: 200 });
    } else{
        const { name, email, picture, sub } = token;
   

        try {
          // Exchange GitHub code for an access token
         
      
      
      
          // Check if user already exists in the database
          let user: IUser | null = await UserModel.findOne({ emailId: email }).exec();
        //   console.log('123yaha aya 4', req.body)
      
          if (!user) {
              console.log('creating new user....')
            // Create new user with an initial limit of 10 API calls
            user = new UserModel({
              emailId: email, // Use GitHub email or a fallback
              githubId: email,
              username: name,
              totalCallAvailable: 10, // ✅ Initial limit of 10 API calls
              totalCallsExec: 0,
              subscribed: false,
              subscriptionId: "",
            });
      
            await user.save();
          }
      
          // Generate JWT Token
          const jwtToken = generateJWT({ email: user.emailId, githubId: user.githubId });
      
          NextResponse.json({ jwtToken, user }, { status: 200 });
        } catch (error) {
          console.error("GitHub Login Error:", error);
          NextResponse.json({ error: "Internal server error" }, { status: 500});
        }
    }
}