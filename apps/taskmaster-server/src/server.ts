import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma/client";
import authRoutes from "./routes/auth.routes";
import protectRoutes from "./routes/protectRoutes";
import { errorHandler } from "./middlewares/errorHandler";

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
    app.get("/", async (_req, res) => {
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
