import { Router } from "express";
import { authToken } from "../middlewares/authToken";
import {
  boardCreateController,
  getBoardsByUserController,
} from "../controllers/board.controller";

const router = Router();

router.post("/create", authToken, boardCreateController);
router.get("/", authToken, getBoardsByUserController);

export default router;
