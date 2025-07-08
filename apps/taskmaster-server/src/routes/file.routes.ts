import express from "express";
import { uploadFile } from "../middlewares/uploadFile"; // multer middleware
import {
  deleteFileController,
  getFilesByTaskController,
  uploadFileController,
} from "../controllers/file.controller";
import { authToken } from "../middlewares/authToken";

const router = express.Router();

router.post("/:taskId", authToken, uploadFile, uploadFileController);
router.get("/:taskId", authToken, getFilesByTaskController);
router.delete("/:fileId", authToken, deleteFileController);

export default router;
