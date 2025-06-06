import { prisma } from "../prisma/client";

interface TaskInput {
  boardId: string;
  title: string;
  description: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE" | "PENDING_REVIEW";
  creatorId: string;
  assigneeId?: string;
}

// type Task = {
//   id: string;
//   title: string;
//   description: string;
//   boardId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   assigneeId?: string;
// };

export const createTask = async ({
  boardId,
  title,
  description,
  creatorId,
  assigneeId = "",
  status = "TODO",
}: TaskInput) => {
  try {
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        members: {
          some: {
            id: creatorId,
          },
        },
      },
    });

    if (!board) {
      throw new Error("User is not a member of the board");
    }
    const task = await prisma.task.create({
      data: {
        title: title || "Untitled Task",
        description,
        status,
        boardId,
        assignedToId: assigneeId,
      },
    });
    return task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Failed to create task");
  }
};

export const getTasksByBoard = async (boardId: string) => {
  return await prisma.task.findMany({
    where: { boardId },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
