import { Response } from "express";
import { AuthRequest } from "../middlewares/authToken";
import {
  addBoardMember,
  createBoard,
  getBoardById,
  getBoardMembers,
  getBoardsByUser,
  removeBoardMember,
} from "../services/board.service";

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

export const getBoardByIdController = async (
  req: AuthRequest,
  res: Response
) => {
  const { boardId } = req.params;

  if (!boardId) {
    res.status(401).json({ message: "Board ID is required" });
    return;
  }

  try {
    const board = await getBoardById(boardId);
    res.status(200).json(board);
  } catch (e) {
    res.status(500).json({ message: "Error fetching board" });
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

export const addBoardMembersController = async (
  req: AuthRequest,
  res: Response
) => {
  const { boardId } = req.params;
  const { userId, role } = req.body; // userId — кого добавляем

  if (!userId) {
    res.status(400).json({ message: "Missing userId" });
  }

  try {
    const newMember = await addBoardMember(userId, boardId, role);
    res.status(200).json(newMember);
  } catch (e) {
    res.status(500).json({ message: e + "Error adding board member" });
  }
};

export const getBoardMembersController = async (
  req: AuthRequest,
  res: Response
) => {
  const { boardId } = req.params;

  try {
    const members = await getBoardMembers(boardId);
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: "Error fetching board members" });
  }
};

export const removeBoardMemberController = async (
  req: AuthRequest,
  res: Response
) => {
  const { boardId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ message: "Missing userId" });
    return;
  }

  try {
    const result = await removeBoardMember(userId, boardId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error removing board member" });
  }
};
