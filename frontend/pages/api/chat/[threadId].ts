import type { NextApiRequest, NextApiResponse } from "next";
import { connectMongoClient } from "@/lib/db";
import { verifyJWT } from "@/lib/jwtUtils";
import UserModel from "@/models/User";
import { callAgent } from "@/lib/agent";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log('[frontedn-threadid]')
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return res.status(403).json({ error: "Invalid token" });
    }

    const { message } = req.body;
    const { threadId } = req.query;

    const user = await UserModel.findOne({
      emailId: decoded.email,
      githubId: decoded.githubId,
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (message.length > user.maxMessageLength) {
      return res.status(400).json({ error: "Message too long" });
    }

    if (user.totalCallsExec >= user.totalCallAvailable) {
      return res.status(429).json({ error: "API limit exceeded" });
    }

    user.totalCallsExec += 1;
    await user.save();

    const mongoClient = await connectMongoClient();
    const response = await callAgent(mongoClient, message, threadId as string);

    return res.status(200).json({ response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
