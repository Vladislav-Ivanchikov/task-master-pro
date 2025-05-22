import e, { Response, Request } from "express";
import { createTask, getTasksByBoard } from "../services/task.service";

export const taskCreateController = async (req: Request, res: Response) => {
  try {
    const task = await createTask(req.body);
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
  req: Request,
  res: Response
) => {
  try {
    const { boardId } = req.params;
    if (!boardId) {
      res.status(400).json({ message: "Board ID is required" });
      return;
    }

    const tasks = await getTasksByBoard(boardId);
    if (!tasks) {
      res.status(404).json({ message: "No tasks found for this board" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getTasksByBoardController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
