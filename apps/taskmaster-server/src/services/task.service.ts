import { prisma } from "../prisma/client";

interface TaskInput {
  boardId: string;
  title: string;
  description: string;
}

type Task = {
  id: string;
  title: string;
  description: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const createTask = async ({
  boardId,
  title,
  description,
}: TaskInput): Promise<Task> => {
  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });
    if (!board) {
      throw new Error("Board not found");
    }

    const task = await prisma.task.create({
      data: {
        title: title || "Untitled Task",
        description,
        boardId,
        creatorId: "defaultCreatorId",
        assigneeId: "defaultAssigneeId",
      },
    });
    return {
      ...task,
      description: task.description ?? "",
    };
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
};

export const getTasksByBoard = async (
  boardId: string
): Promise<Task[] | undefined> => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        boardId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tasks.map((task) => ({
      ...task,
      description: task.description ?? "",
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return undefined;
  }
};
