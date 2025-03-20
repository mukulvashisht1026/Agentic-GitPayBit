import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRY = "1h"; // Token expiry time

export const generateJWT = (user: { email: string; githubId: string }): string => {
  return jwt.sign(
    { email: user.email, githubId: user.githubId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
};

export const verifyJWT = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
