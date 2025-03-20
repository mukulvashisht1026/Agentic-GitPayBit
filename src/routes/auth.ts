import express, { Request, Response } from "express";
import axios from "axios";
import { generateJWT } from "../utils/jwtUtils";
import UserModel, { IUser } from "../models/User";

const router = express.Router();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/**
 * ✅ GitHub OAuth Login - Creates user in MongoDB if they don't exist
 */
router.post("/github-login", async (req: Request, res: Response): Promise<void> => {
  
    const { token } = req.body;
    if (!token) {
        console.log('[github-login] internal servier error due to req.body')
        res.status(500).json({ error: "invalid token" });
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
      
          res.status(200).json({ jwtToken, user });
        } catch (error) {
          console.error("GitHub Login Error:", error);
          res.status(500).json({ error: "Internal server error" });
        }
    }
    // console.log('reqbody1', req.body)
    // console.log('req - body 124: ', req.body['token'])
    // console.log('thoken is1 : ', token)
  
});

export default router;
