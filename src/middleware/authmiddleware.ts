import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwtUtils";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract JWT from header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const decoded = verifyJWT(token);

  if (!decoded) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  req.user = decoded; // Attach user info to request
  next();
};
