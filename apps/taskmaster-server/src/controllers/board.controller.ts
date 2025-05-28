import { Response } from "express";
import { AuthRequest } from "../middlewares/authToken";
import { createBoard, getBoardsByUser } from "../services/board.service";

export const boardCreateController = async (
  req: AuthRequest,
  res: Response
) => {
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    res.status(400).json({ message: "Board name is required" });
    return;
  }

  if (!req.user?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const board = await createBoard(req.user.userId, title, description);
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: "Error creating board" });
  }
};

export const getBoardsByUserController = async (
  req: AuthRequest,
  res: Response
) => {
  const { userId, role } = req.user || {};
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!role) {
    res.status(400).json({ message: "Role is required" });
    return;
  }

  try {
    const boards = await getBoardsByUser(userId, role);
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: "Error fetching boards" });
  }
};
