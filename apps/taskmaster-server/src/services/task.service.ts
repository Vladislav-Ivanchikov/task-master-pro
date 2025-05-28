import { prisma } from "../prisma/client";

interface TaskInput {
  boardId: string;
  title: string;
  description: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE";
  creatorId: string;
  assigneeId?: string;
}

type Task = {
  id: string;
  title: string;
  description: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  assigneeId?: string;
};

export const createTask = async ({
  boardId,
  title,
  description,
  creatorId,
  assigneeId = "",
  status = "TODO",
}: TaskInput): Promise<Task> => {
  try {
    const member = await prisma.boardMember.findFirst({
      where: { boardId, userId: creatorId },
    });
    if (!member) {
      throw new Error("User is not a member of the board");
    }

    const task = await prisma.task.create({
      data: {
        title: title || "Untitled Task",
        description,
        status,
        boardId,
        creatorId,
        assigneeId,
      },
    });
    return task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
};

export const getTasksByBoard = async (
  boardId: string
): Promise<Task[] | undefined> => {
  try {
    return await prisma.task.findMany({
      where: {
        boardId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return undefined;
  }
};
