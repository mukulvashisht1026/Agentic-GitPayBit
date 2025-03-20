import { User } from "../../models/User"; // Adjust path if needed

declare global {
  namespace Express {
    interface Request {
      user?: typeof User;
    }
  }
}
export {};
