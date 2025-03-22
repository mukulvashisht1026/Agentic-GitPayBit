import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateJWT(payload: { email: string; githubId: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { email: string; githubId: string };
  } catch {
    return null;
  }
}
