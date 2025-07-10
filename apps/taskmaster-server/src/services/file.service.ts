import { prisma } from "../prisma/client";

export const checkTaskExists = async (taskId: string) => {
  return prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true },
  });
};

export const saveTaskFile = async ({
  taskId,
  name,
  url,
  uploaderId,
  key,
}: {
  taskId: string;
  name: string;
  url: string;
  uploaderId: string;
  key?: string;
}) => {
  return prisma.taskFile.create({
    data: {
      taskId,
      name,
      url,
      uploaderId,
      key: key ?? "",
    },
  });
};

export const getFilesByTask = async (taskId: string) => {
  return prisma.taskFile.findMany({
    where: { taskId },
    orderBy: { createdAt: "desc" },
  });
};

export const getTaskFileById = async (id: string) => {
  return prisma.taskFile.findUnique({
    where: { id },
    include: {
      task: {
        select: {
          creatorId: true,
        },
      },
    },
  });
};

export const deleteTaskFileById = async (id: string) => {
  return prisma.taskFile.delete({
    where: { id },
  });
};
