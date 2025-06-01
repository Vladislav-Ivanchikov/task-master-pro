import { Request, Response } from "express";
import { searchUsersService } from "../services/users.service";

export const searchUsers = async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query || query.trim() === "") {
    res.status(400).json({ message: "Query is required" });
  }

  try {
    const users = await searchUsersService(query);
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
