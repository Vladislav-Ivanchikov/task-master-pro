import { Router } from "express";
import { AuthRequest, authToken } from "../middlewares/authToken";

const router = Router();

router.get("/me", authToken, (req: AuthRequest, res) => {
  res.json({ message: "Access granted", user: req.user });
});

export default router;
