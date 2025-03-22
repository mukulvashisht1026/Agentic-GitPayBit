import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGO_URL = process.env.MONGODB_CONNECTION_URL!;
let mongoClient: MongoClient;

export async function connectMongoClient() {
  if (!mongoClient) {
    mongoClient = new MongoClient(MONGO_URL);
    await mongoClient.connect();
    console.log("Connected MongoClient");
  }
  return mongoClient;
}

// Optional: Connect mongoose once globally
if (!mongoose.connection.readyState) {
  mongoose.connect(MONGO_URL).then(() => {
    console.log("Connected to Mongoose");
  }).catch(console.error);
}
