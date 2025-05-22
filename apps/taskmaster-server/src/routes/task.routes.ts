import { Router } from "express";
import { authToken } from "../middlewares/authToken";
import {
  getTasksByBoardController,
  taskCreateController,
} from "../controllers/task.controller";

const router = Router();

router.post("/create", authToken, taskCreateController);
router.get("/:boardId", authToken, getTasksByBoardController);

export default router;
