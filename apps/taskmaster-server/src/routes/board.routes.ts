import { Router } from "express";
import { authToken } from "../middlewares/authToken";
import {
  addBoardMembersController,
  boardCreateController,
  deleteBoardController,
  getBoardByIdController,
  getBoardsByUserController,
  removeBoardMemberController,
} from "../controllers/board.controller";

const router = Router();

router.post("/create", authToken, boardCreateController);
router.get("/", authToken, getBoardsByUserController);
router.get("/:boardId", authToken, getBoardByIdController);
router.delete("/:boardId", authToken, deleteBoardController);

router.post("/:boardId/members", authToken, addBoardMembersController);
router.delete(
  "/:boardId/members/:userId",
  authToken,
  removeBoardMemberController
);

export default router;
