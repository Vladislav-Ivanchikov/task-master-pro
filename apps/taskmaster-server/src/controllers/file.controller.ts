import { Request, Response } from "express";
import {
  deleteObjectFromS3,
  getPresignedUrl,
  uploadToS3,
} from "../lib/s3Client";
import {
  saveTaskFile,
  checkTaskExists,
  getFilesByTask,
  getTaskFileById,
  deleteTaskFileById,
} from "../services/file.service";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../middlewares/authToken";

export const uploadFileController = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const file = req.file;
    const userId = req.user?.userId;

    if (!taskId) {
      res.status(400).json({ error: "ID задачи не передан" });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      return;
    }

    if (!file) {
      res.status(400).json({ error: "Файл не передан" });
      return;
    }

    const taskExists = await checkTaskExists(taskId);
    if (!taskExists) {
      res.status(404).json({ error: "Задача не найдена" });
      return;
    }

    console.log("Загружаемый файл:", file.originalname);

    const ext = path.extname(file.originalname); // расширение файла
    const fileId = uuidv4(); // уникальный ID для файла
    const key = `tasksFiles/${taskId}/${fileId}${ext}`; // путь в бакете

    const url = await uploadToS3({
      key,
      body: file.buffer,
      contentType: file.mimetype,
    });

    const savedFile = await saveTaskFile({
      taskId,
      name: file.originalname,
      url,
      key,
      uploaderId: userId,
    });

    console.log("Файл успешно загружен");
    res.status(200).json(savedFile);
  } catch (err) {
    console.error("Ошибка при загрузке файла:", err);
    res.status(500).json({ error: "Ошибка сервера" });
    return;
  }
};

export const getFilesByTaskController = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const taskExists = await checkTaskExists(taskId);
    if (!taskExists) {
      res.status(404).json({ error: "Задача не найдена" });
      throw new Error("Task not found");
    }

    const files = await getFilesByTask(taskId);
    console.log("Полученные файлы задачи:", files);
    if (!files || files.length === 0) {
      res.status(404).json({ error: "Файлы задачи не найдены" });
      throw new Error("No files found for task");
    }
    res.status(200).json(files);
  } catch (err) {
    console.error("Ошибка при получении файлов задачи:", err);
    res.status(500).json({ error: "Ошибка сервера" });
    throw err;
  }
};

export const deleteFileController = async (req: AuthRequest, res: Response) => {
  try {
    const { fileId } = req.params;
    const userId = req.user?.userId;

    console.log(req.params);
    const file = await getTaskFileById(fileId);

    if (!file) {
      res.status(404).json({ error: "Файл не найден" });
      throw new Error("File not found");
    }

    if (!userId) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      throw new Error("User not authenticated");
    }

    const isUploader = file.uploaderId === userId;
    const isCreator = file.task.creatorId === userId;

    if (!isUploader && !isCreator) {
      res.status(403).json({ error: "Недостаточно прав для удаления файла" });
      throw new Error("Недостаточно прав для удаления файла");
    }

    // Извлекаем key из URL (после домена)
    console.log("Удаляем файл с ключом:", file.key);

    await deleteObjectFromS3(file.key);
    await deleteTaskFileById(file.id);

    res.status(200).json({ success: true });
    console.log("Файл успешно удален");
    return;
  } catch (err) {
    console.error("Ошибка при удалении файла:", err);
    res.status(500).json({ error: "Ошибка сервера" });
    throw err;
  }
};

export const getPresignedFileUrlController = async (
  req: Request,
  res: Response
) => {
  try {
    const { fileId } = req.params;
    const file = await getTaskFileById(fileId);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      throw new Error("File not found");
    }

    console.log("Получаем presigned URL для файла:", file.url);

    const bucketName = process.env.S3_BUCKET_NAME!;
    const key = new URL(file.url).pathname.replace(`/${bucketName}/`, "");

    const signedUrl = await getPresignedUrl(file.key);

    res.status(200).json({ url: signedUrl });
  } catch (err: any) {
    console.error("Error generating presigned URL:", err);
    res.status(500).json({ error: "Failed to generate presigned URL" });
    throw new Error(err.message || "Failed to generate presigned URL");
  }
};
