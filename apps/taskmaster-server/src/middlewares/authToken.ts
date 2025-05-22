import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthToken {
  userId: string;
}

export interface AuthRequest extends Request {
  user?: AuthToken;
}

export const authToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        (() => {
          throw new Error("JWT_SECRET is not defined");
        })()
    ) as AuthToken;
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
