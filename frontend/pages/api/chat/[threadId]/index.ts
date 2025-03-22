import { NextRequest, NextResponse } from "next/server";
import { connectMongoClient } from "@/lib/db";
import { verifyJWT } from "@/lib/jwtUtils";
import UserModel from "@/models/User";
import { callAgent } from "@/lib/agent";

export default async function POST(
  req: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const body = await req.json();
    const { message } = body;

    const user = await UserModel.findOne({
      emailId: decoded.email,
      githubId: decoded.githubId,
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (message.length > user.maxMessageLength) {
      return NextResponse.json({ error: "Message too long" }, { status: 400 });
    }

    if (user.totalCallsExec >= user.totalCallAvailable) {
      return NextResponse.json({ error: "API limit exceeded" }, { status: 429 });
    }

    user.totalCallsExec += 1;
    await user.save();

    const mongoClient = await connectMongoClient();
    const response = await callAgent(mongoClient, message, params.threadId);

    return NextResponse.json({ response });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
