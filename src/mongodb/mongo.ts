import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import { callAgent } from '../agentZero/agent';
const cors = require('cors');
import "dotenv/config";

const app: Express = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_CONNECTION_URL as string);

async function startServer() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        app.get('/', (req: Request, res: Response) => {
          res.send('LangGraph Agent Server');
        });
        app.post('/chat', async (req: Request, res: Response) => {
          const initialMessage = req.body.message;
          const threadId = Date.now().toString(); 
          try {
            const response = await callAgent(client, initialMessage, threadId);
            res.json({ threadId, response });
          } catch (error) {
            console.error('Error starting conversation:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
        });

        app.post('/chat/:threadId', async (req: Request, res: Response) => {
          const { threadId } = req.params;
          const { message } = req.body;
          try {
            const response = await callAgent(client, message, threadId);
            res.json({ response });
          } catch (error) {
            console.error('Error in chat:', error);
            res.status(500).json({ error: 'Internal server error' });
          }
        });


        app.get("/get-code", async (req: Request, res: Response) => {
            const userMessage = req.query.message as string || "Say this is a test!"; // Get message from query parameter
            const wrappedMessage = "after colon is the message and I want you to wrap it in html and  provide  your final output enclosing in div tag if there is markdown language in the message convert it to html tags : "+ userMessage;
            // const wrappedMessage = "after colon is the message and I want you to wrap it in html and  provide  your final output enclosing in div tag , also if any HTML code is there in the messege then only output the html code and remove any text outside of it. and if there is no html code then just dispay text in formatted html code and remove other formattings and if there is css then make all the css inline in the html code: "+ userMessage;
            
            try {
              console.log("render-api-gets-called");
                
              // OpenAI API Call
              const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                  model: "gpt-4o-mini",
                  messages: [{ role: "user", content: userMessage }],
                  temperature: 0.7,
                }),
              });
          
              const data = await openaiResponse.json();
          
              // Extract the AI-generated response
              const codeString = data.choices?.[0]?.message?.content || "<div>Hello world</div>";
          
              res.json({ codeString });
            } catch (error) {
              console.error("Error calling OpenAI API:", error);
              res.status(500).json({ error: "Internal server error" });
            }
          });

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
        });
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
      }



}

startServer(); 
