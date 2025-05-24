import { Router } from "express";
import { register, login, profile } from "../controllers/auth.controller";
import { authToken } from "../middlewares/authToken";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authToken, profile);

export default router;
