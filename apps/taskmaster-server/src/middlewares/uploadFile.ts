import multer from "multer";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB

export const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
}).single("file");
