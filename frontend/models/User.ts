import mongoose, { Document, Schema, Model } from "mongoose";

// Define an interface representing a user document in MongoDB
export interface IUser extends Document {
  emailId: string;
  totalCallAvailable: number;
  totalCallsExec: number;
  subscribed: boolean;
  subscriptionId: string;
  githubId: string;
  maxMessageLength: number;
}

// Define Mongoose schema for the User collection
const UserSchema = new Schema<IUser>({
  emailId: { type: String, required: true, unique: true },
  totalCallAvailable: { type: Number, default: 5 },
  totalCallsExec: { type: Number, default: 0 },
  subscribed: { type: Boolean, default: false },
  subscriptionId: { type: String, default: null },
  githubId: { type: String, default: null },
  maxMessageLength: { type: Number, default: 20 },
});

// Define the Mongoose Model type
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);


export default UserModel; // ✅ Correctly typed export
