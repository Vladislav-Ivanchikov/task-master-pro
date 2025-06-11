import { Router } from "express";
import { authToken } from "../middlewares/authToken";
import {
  addTaskAssigneeController,
  deleteTaskController,
  getTaskController,
  getTasksByBoardController,
  removeTaskAssigneeController,
  taskCreateController,
  updateTaskStatusController,
} from "../controllers/task.controller";

const router = Router();

router.post("/create", authToken, taskCreateController);
router.get("/board/:boardId", authToken, getTasksByBoardController);
router.get("/task/:taskId", authToken, getTaskController);

router.post("/:taskId/assignees", authToken, addTaskAssigneeController);
router.delete(
  "/:taskId/assignees/:userId",
  authToken,
  removeTaskAssigneeController
);

router.delete("/:taskId", authToken, deleteTaskController);
router.patch("/:taskId/status", authToken, updateTaskStatusController);

export default router;
