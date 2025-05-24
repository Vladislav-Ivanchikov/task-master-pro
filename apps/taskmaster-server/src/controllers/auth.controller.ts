import { Request, Response, NextFunction } from "express";
import { loginUser, profileUser, registerUser } from "../services/auth.service";
import { User } from "../types/User";
import { AuthRequest } from "../middlewares/authToken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(409).json({ message: error.message });
      next(error);
    }
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
      next(error);
    }
  }
};

export const profile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await profileUser(userId);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
      next(error);
    }
  }
};
