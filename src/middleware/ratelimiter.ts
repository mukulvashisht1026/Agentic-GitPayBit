import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwtUtils";
import { User } from "../models/User";

export const rateLimiterWithAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract JWT token
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify and decode JWT
        const decoded = verifyJWT(token);

        if (!decoded) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }

        // Fetch user from DB using decoded data
        const user = await User.findOne({ email: decoded.email, githubId: decoded.githubId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Rate limiting logic
        if (user.totalCallsExec >= user.totalCallAvailable) {
            return res.status(429).json({ error: "API request limit exceeded" });
        }

        // Increment API call counter and save
        user.totalCallsExec += 1;
        await user.save();

        // Attach user to request for future use
        req.user = user;
        next();
    } catch (error) {
        console.error("Rate Limiter & Auth Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
