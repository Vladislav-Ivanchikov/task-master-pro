import { Response, Request, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authToken";
import {
  addTaskAssignee,
  createTask,
  deleteTask,
  getTask,
  getTasksByBoard,
  removeTaskAssignee,
  updateTaskStatus,
} from "../services/task.service";

export const taskCreateController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { userId } = req.user;

    const { boardId, title, description = "", status, assigneeId } = req.body;
    if (!boardId || !title || !title.trim()) {
      res.status(400).json({ message: "Board ID and title are required" });
      return;
    }

    const task = await createTask({
      boardId,
      title: title.trim(),
      description: description.trim(),
      status: status || "TODO",
      creatorId: userId,
      assigneeId: assigneeId || userId,
    });
    if (!task) {
      res.status(400).json({ message: "Error creating task" });
      return;
    }
    res.status(201).json(task);
  } catch (error) {
    console.error("Error in taskCreateController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTasksByBoardController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { boardId } = req.params;
    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }
    if (!boardId) {
      res.status(400).json({ message: "Board ID is required" });
      return;
    }

    const tasks = await getTasksByBoard(boardId);
    if (!tasks) {
      res.status(404).json({ message: "No tasks found for this board" });
      return;
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getTasksByBoardController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addTaskAssigneeController = async (
  req: AuthRequest,
  res: Response
) => {
  const { taskId } = req.params;
  const { userId } = req.body;

  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  if (!taskId) {
    res.status(404).json({ error: "taskId is required" });
    return;
  }

  try {
    const assignee = await addTaskAssignee(taskId, userId);
    res.status(200).json(assignee);
  } catch (error) {
    console.error("Error in addTaskAssigneeController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskController = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;

  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  if (!taskId) {
    res.status(404).json({ error: "taskId is required" });
    return;
  }

  try {
    const task = await getTask(taskId);
    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTaskController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTaskStatusController = async (
  req: AuthRequest,
  res: Response
) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!["TODO", "IN_PROGRESS", "PENDING_REVIEW", "DONE"].includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  if (!req.user || !req.user.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  if (!taskId) {
    res.status(404).json({ error: "taskId is required" });
    return;
  }

  try {
    const task = await updateTaskStatus(taskId, status, req.user.userId);
    res.status(200).json(task);
  } catch (error) {
    console.error("Error in updateTaskStatusController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeTaskAssigneeController = async (
  req: AuthRequest,
  res: Response
) => {
  const { taskId, userId } = req.params;

  if (!req.user?.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  if (!userId) {
    res.status(400).json({ message: "userId is required" });
    return;
  }

  try {
    const result = await removeTaskAssignee(taskId, userId, req.user.userId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in removeTaskAssigneeController:", error);
    res.status(403).json({ message: error.message || "Access denied" });
  }
};

export const deleteTaskController = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;

  if (!req.user?.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const result = await deleteTask(taskId, req.user.userId);
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error in deleteTaskController:", error);
    res.status(403).json({ message: error.message || "Access denied" });
  }
};
