import { Router } from "express";
import { searchUsers } from "../controllers/users.controller";
import { authToken } from "../middlewares/authToken";

const router = Router();

router.get("/search", authToken, searchUsers);

export default router;
