import { Request, Response } from "express";
import { deleteObjectFromS3, uploadToS3 } from "../lib/s3Client";
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
      throw new Error("Task ID not provided");
    }

    if (!userId) {
      res.status(401).json({ error: "Пользователь не авторизован" });
      throw new Error("User not authenticated");
    }

    if (!file) {
      res.status(400).json({ error: "Файл не передан" });
      throw new Error("File not provided");
    }

    const taskExists = await checkTaskExists(taskId);
    if (!taskExists) {
      res.status(404).json({ error: "Задача не найдена" });
      throw new Error("Task not found");
    }

    console.log("Загружаемый файл:", file.originalname);

    const ext = path.extname(file.originalname); // расширение файла
    const fileId = uuidv4(); // уникальный ID для файла
    const key = `tasksFiles/${taskId}/${fileId}${ext}`; // путь в бакете

    // Загружаем файл в S3
    const url = await uploadToS3({
      key,
      body: file.buffer,
      contentType: file.mimetype,
    });

    // Сохраняем запись о файле в базе
    const savedFile = await saveTaskFile({
      taskId,
      name: file.originalname,
      url,
      uploaderId: userId,
    });

    console.log("Файл успешно загружен");
    res.status(200).json(savedFile);
  } catch (err) {
    console.error("Ошибка при загрузке файла:", err);
    res.status(500).json({ error: "Ошибка сервера" });
    throw err;
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
    const key = new URL(file.url).pathname.slice(1); // убираем начальный слэш
    console.log("Удаляем файл с ключом:", new URL(file.url).pathname);

    await deleteObjectFromS3(key);
    await deleteTaskFileById(file.id);

    res.status(200).json({ success: true });
    console.log("Файл успешно удален");
  } catch (err) {
    console.error("Ошибка при удалении файла:", err);
    res.status(500).json({ error: "Ошибка сервера" });
    throw err;
  }
};
