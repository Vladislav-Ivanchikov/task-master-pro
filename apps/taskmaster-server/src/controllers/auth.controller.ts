import { Request, Response, NextFunction } from "express";
import { registerUser } from "../services/auth.service";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Implement login logic here
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
};
