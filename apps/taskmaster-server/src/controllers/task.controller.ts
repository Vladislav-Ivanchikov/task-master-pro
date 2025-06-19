import { Response, Request, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authToken";
import {
  addTaskAssignee,
  createNote,
  createTask,
  deleteNote,
  deleteTask,
  getNotesByTask,
  getTask,
  getTasksByBoard,
  removeTaskAssignee,
  updateNote,
  updateTaskStatus,
} from "../services/task.service";

export const taskCreateController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const { boardId, title, description = "", status } = req.body;
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
    res.status(400).json({ error: "taskId is required" });
    return;
  }

  try {
    const assignee = await addTaskAssignee(taskId, userId);
    res.status(200).json(assignee);
  } catch (error: any) {
    if (error.message === "Assignee already exists") {
      res.status(409).json({ message: error.message });
      return;
    }
    if (error.message === "Task not found") {
      res.status(404).json({ message: error.message });
      return;
    }
    console.error("Error in addTaskAssigneeController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTaskController = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user?.userId;

  if (!taskId) {
    res.status(400).json({ message: "taskId is required" });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
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
    res.status(400).json({ error: "taskId is required" });
    return;
  }

  try {
    const task = await updateTaskStatus(taskId, status, req.user.userId);
    res.status(200).json(task);
  } catch (error: any) {
    if (error.message === "Task not found") {
      res.status(404).json({ message: error.message });
      return;
    }
    if (
      error.message === "You don't have permission to change the task status"
    ) {
      res.status(403).json({ message: error.message });
      return;
    }
    console.error("Error in updateTaskStatusController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeTaskAssigneeController = async (
  req: AuthRequest,
  res: Response
) => {
  const { taskId, userId } = req.params;

  if (!taskId) {
    res.status(400).json({ message: "taskId is required" });
    return;
  }

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

  if (!taskId) {
    res.status(400).json({ message: "taskId is required" });
    return;
  }

  if (!req.user?.userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const result = await deleteTask(taskId, req.user.userId);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "Task not found") {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message === "Access denied") {
      res.status(403).json({ message: error.message });
      return;
    }
    if (
      error.message ===
      "Task can only be deleted if the only assignee is the board owner"
    ) {
      res.status(409).json({ message: error.message });
      return;
    }
    console.error("Error in deleteTaskController:", error);
    res.status(403).json({ message: error.message || "Access denied" });
  }
};

export const createNoteController = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const { content } = req.body;
  const userId = req.user?.userId;

  if (!taskId) {
    res.status(400).json({ message: "taskId is required" });
    return;
  }

  if (!content?.trim()) {
    res.status(400).json({ message: "content is required" });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const note = await createNote(taskId, content, userId);
    res.status(200).json(note);
  } catch (error: any) {
    console.error("Error in createNoteController:", error);
    res.status(500).json({ message: error.message || "Failed to create note" });
  }
};

export const getTaskNotesController = async (
  req: AuthRequest,
  res: Response
) => {
  const { taskId } = req.params;
  const userId = req.user?.userId;
  if (!taskId) {
    res.status(400).json({ message: "taskId is required" });
    return;
  }
  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }
  try {
    const notes = await getNotesByTask(taskId, userId);
    res.status(200).json(notes);
  } catch (error: any) {
    console.error("Error in getTaskNotesController:", error);
    res.status(500).json({ message: error.message || "Failed to get notes" });
  }
};

export const updateNoteController = async (req: AuthRequest, res: Response) => {
  const { noteId } = req.params;
  const { content } = req.body;
  const userId = req.user?.userId;

  if (!content?.trim()) {
    res.status(400).json({ error: "Content is required" });
    return;
  }

  if (!userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    const updatedNote = await updateNote(noteId, content, userId);
    if (!updatedNote) {
      res.status(404).json({ error: "Note not found" });
      return;
    }
    res.status(200).json(updatedNote);
  } catch (err: any) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: err.message || "Failed to update note" });
  }
};

export const deleteNoteController = async (req: AuthRequest, res: Response) => {
  const { noteId } = req.params;
  const userId = req.user?.userId;

  if (!noteId) {
    res.status(400).json({ message: "noteId is required" });
    return;
  }

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  try {
    const deletedNote = await deleteNote(noteId, userId);
    if (!deletedNote) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.status(204).json(deletedNote);
  } catch (error: any) {
    console.error("Error in deleteNoteController:", error);
    res.status(500).json({ message: error.message || "Failed to delete note" });
  }
};
