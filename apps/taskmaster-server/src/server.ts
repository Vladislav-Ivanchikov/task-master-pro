import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma/client";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.routes";
import protectRoutes from "./routes/protect.routes";
import boardRoutes from "./routes/board.routes";
import taskRoutes from "./routes/task.routes";

// Express server setup
export const startServer = () => {
  try {
    dotenv.config();
    const app = express();
    const PORT = process.env.PORT || 3000;
    app.use(cors());
    app.use(express.json());

    app.use("/api/auth", authRoutes);
    app.use("/api/protected", protectRoutes);
    app.use("/api/boards", boardRoutes);
    app.use("/api/tasks", taskRoutes);

    // app.get("/users", async (_req, res) => {
    //   const users = await prisma.user.findMany();
    //   res.json(users);
    // });

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
