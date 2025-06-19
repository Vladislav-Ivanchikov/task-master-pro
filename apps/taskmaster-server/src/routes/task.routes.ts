import { Router } from "express";
import { authToken } from "../middlewares/authToken";
import {
  addTaskAssigneeController,
  createNoteController,
  deleteNoteController,
  deleteTaskController,
  getTaskController,
  getTaskNotesController,
  getTasksByBoardController,
  removeTaskAssigneeController,
  taskCreateController,
  updateNoteController,
  updateTaskStatusController,
} from "../controllers/task.controller";

const router = Router();

router.post("/create", authToken, taskCreateController);
router.get("/board/:boardId", authToken, getTasksByBoardController);
router.get("/task/:taskId", authToken, getTaskController);

router.post("/:taskId/notes", authToken, createNoteController);
router.get("/:taskId/notes", authToken, getTaskNotesController);
router.patch("/:taskId/notes/:noteId", authToken, updateNoteController);
router.delete("/:taskId/notes/:noteId", authToken, deleteNoteController);

router.post("/:taskId/assignees", authToken, addTaskAssigneeController);
router.delete(
  "/:taskId/assignees/:userId",
  authToken,
  removeTaskAssigneeController
);

router.delete("/task/:taskId", authToken, deleteTaskController);
router.patch("/:taskId/status", authToken, updateTaskStatusController);

export default router;
