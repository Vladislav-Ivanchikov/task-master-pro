import e, { Response } from "express";
import { AuthRequest } from "../middlewares/authToken";
import {
  addBoardMember,
  createBoard,
  deleteBoard,
  getBoardById,
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

export const deleteBoardController = async (
  req: AuthRequest,
  res: Response
) => {
  const { boardId } = req.params;

  if (!req.user?.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const result = await deleteBoard(boardId, req.user.userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Board not found") {
      res.status(404).json({ message: error.message || "Board not found" });
      return;
    }
    if (error.message === "Only board owner can delete the board") {
      res.status(403).json({ message: error.message || "Access denied" });
      return;
    }
    if (error.message === "Cannot delete board with other members present") {
      res.status(403).json({ message: error.message || "Access denied" });
      return;
    }
    console.error("Error in deleteBoardController:", error);
    res.status(500).json({ message: "Error deleting board" });
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
  const { userId } = req.body; // userId — кого добавляем

  if (!userId) {
    res.status(400).json({ message: "Missing userId" });
  }

  try {
    const newMember = await addBoardMember(userId, boardId);
    res.status(200).json(newMember);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const removeBoardMemberController = async (
  req: AuthRequest,
  res: Response
) => {
  const { boardId, userId: memberId } = req.params;

  if (!req.user?.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const result = await removeBoardMember(boardId, memberId, req.user.userId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in removeBoardMemberController:", error);
    return res.status(400).json({ message: error.message || "Access denied" });
  }
};
