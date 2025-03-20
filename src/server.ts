import express, { Express, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import { callAgent } from "./agentZero/agent";
import cors from "cors";
import "dotenv/config";
import UserModel, { IUser } from "./models/User"; // Import User Model
import authRoutes from "./routes/auth";
import { verifyJWT } from "./utils/jwtUtils";
// import { authenticateJWT } from "./middleware/authmiddleware";


declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const app: Express = express();
app.use(cors());
app.use(express.json());

// Create a MongoDB native client instance
const mongoClient = new MongoClient(process.env.MONGODB_CONNECTION_URL as string);

async function connectMongoDB() {
  try {
    await mongoClient.connect();
    console.log("MongoClient connected successfully!");
  } catch (error) {
    console.error("MongoClient connection error:", error);
    process.exit(1);
  }
}

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_URL as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
  .then(() => console.log("Connected to MongoDB using Mongoose"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Rate Limiting Middleware
const rateLimiterWithAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    
    console.log('[rateLimiterWithAuth: ] : ', req.headers)
      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) {
      console.log('token------>', token)

          res.status(401).json({ error: "Unauthorized: No token provided" });
          return;
      }

      const decoded = verifyJWT(token);

      if (!decoded) {
        console.log('faileddecoded------>', decoded)

          res.status(403).json({ error: "Invalid or expired token" });
          return;
      }
      console.log('decoded------>', decoded)
      const query = { emailId: decoded.email, githubId: decoded.githubId }
      console.log('[ratelimiter] query: ', query)
      const user = await UserModel.findOne(query);

      if (!user) {
        console.log('user---->', user)
          res.status(404).json({ error: "User not found" });
          return;
      }

      const { message } = req.body;
      if (message && message.length > user.maxMessageLength) {
        res.status(400).json({ error: "Message exceeds 20 character limit" });
        return;
      }
  

      if (user.totalCallsExec >= user.totalCallAvailable) {
          res.status(429).json({ error: "API request limit exceeded" });
          return;
      }

      user.totalCallsExec += 1;
      await user.save();

      req.user = user; // Attach user info for future use
      next();
  } catch (error) {
      console.error("Rate Limiter & Auth Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

// const messgaeCountmiddleware  = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const { message } = req.body;
//   if (message && message.length > 100) {
//     res.status(400).json({ error: "Message exceeds 100 character limit" });
//     return;
//   }
//   next();
// };

app.get('/', (req: Request, res: Response) => {
  res.send('LangGraph Agent Server');
});

app.use("/auth", authRoutes);
// app.use("/api", protectedRoutes);



// Apply rate limiter and pass `mongoClient` to `callAgent`
app.post('/chat', rateLimiterWithAuth, async (req: Request, res: Response) => {
  const { emailId, message } = req.body;
  const threadId = Date.now().toString();

  try {
    const response = await callAgent(mongoClient, message, threadId);
    res.json({ threadId, response });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/chat/:threadId', rateLimiterWithAuth, async (req: Request, res: Response) => {
  const { threadId } = req.params;
  const { emailId, message } = req.body;

  try {
    const response = await callAgent(mongoClient, message, threadId);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// OpenAI API Route
// app.get("/get-code", async (req: Request, res: Response) => {
//   const userMessage = req.query.message as string || "Say this is a test!";
//   const wrappedMessage = "Wrap the following message in HTML: " + userMessage;

//   try {
//     console.log("Calling OpenAI API...");

//     const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [{ role: "user", content: wrappedMessage }],
//         temperature: 0.7,
//       }),
//     });

//     const data = await openaiResponse.json();
//     const codeString = data.choices?.[0]?.message?.content || "<div>Hello world</div>";

//     res.json({ codeString });
//   } catch (error) {
//     console.error("Error calling OpenAI API:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Reset API Usage Route
app.post("/api/reset", async (req: Request, res: Response) => {
  const { emailId } = req.body;

  try {
    const user = await UserModel.findOne({ emailId });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.totalCallsExec = 0;
    await user.save();

    res.json({ message: "API usage reset!" });
  } catch (error) {
    console.error("Reset API Usage Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Express Server and Connect MongoDB
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await connectMongoDB(); // Ensure MongoClient is connected before handling requests
  console.log(`Server running on port ${PORT}`);
});
