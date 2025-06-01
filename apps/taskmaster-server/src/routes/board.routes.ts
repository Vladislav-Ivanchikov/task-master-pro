import { Router } from "express";
import { authToken } from "../middlewares/authToken";
import {
  addBoardMembersController,
  boardCreateController,
  getBoardByIdController,
  getBoardMembersController,
  getBoardsByUserController,
  removeBoardMemberController,
} from "../controllers/board.controller";

const router = Router();

router.post("/create", authToken, boardCreateController);
router.get("/", authToken, getBoardsByUserController);
router.get("/:boardId", authToken, getBoardByIdController);

router.post("/:boardId/members", authToken, addBoardMembersController);
router.get("/:boardId/members", authToken, getBoardMembersController);
router.delete(
  "/:boardId/members/:userId",
  authToken,
  removeBoardMemberController
);

export default router;
