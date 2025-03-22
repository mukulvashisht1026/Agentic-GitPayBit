import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/User";

export async function POST(req: NextRequest) {
  const { emailId } = await req.json();

  const user = await UserModel.findOne({ emailId });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.totalCallsExec = 0;
  await user.save();

  return NextResponse.json({ message: "API usage reset!" });
}
