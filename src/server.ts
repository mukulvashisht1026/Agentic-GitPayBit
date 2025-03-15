import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Handle any HTTP method on any route
app.all("*", (req: Request, res: Response) => {
    console.log({
        message: "Request received",
        method: req.method,
        path: req.path,
        headers: req.headers,
        body: req.body,
        query: req.query,
      });
  
  
    res.json({
    message: "Request received",
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
    query: req.query,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
