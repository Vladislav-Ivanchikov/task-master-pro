import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";
import protectRoutes from "./routes/protect.routes";
import boardRoutes from "./routes/board.routes";
import taskRoutes from "./routes/task.routes";
import usersRoutes from "./routes/users.routes";
import { prisma } from "./prisma/client";
dotenv.config();

// Express server setup
export const startServer = () => {
  try {
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRoutes);
    app.use("/api/protected", protectRoutes);
    app.use("/api/boards", boardRoutes);
    app.use("/api/tasks", taskRoutes);
    app.use("/api/users", usersRoutes);

    app.get("/users", async (_req, res) => {
      const users = await prisma.user.findMany();
      res.json(users);
    });

    // Error handling middleware
    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};
