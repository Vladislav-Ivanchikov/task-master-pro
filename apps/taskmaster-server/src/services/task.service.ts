import { prisma } from "../prisma/client";

interface TaskInput {
  boardId: string;
  title: string;
  description?: string;
}

export const createTask = async ({
  boardId,
  title,
  description,
}: TaskInput) => {
  try {
    const task = await prisma.task.create({
      data: {
        title: title || "Untitled Task",
        description,
        boardId,
      },
    });
    return task;
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export const getTasksByBoard = async (boardId: string) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        boardId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};
