import { prisma } from "../prisma/client";

export const createBoard = async (userId: string, name: string) => {
  if (!userId || !name?.trim()) {
    throw new Error("User ID and board name are required");
  }

  try {
    const board = await prisma.board.create({
      data: {
        name,
        ownerId: userId,
      },
    });
    return board;
  } catch (error) {
    console.error("Error creating board:", error);
    throw new Error(
      `Error creating board: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const getBoardsByUser = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const boards = await prisma.board.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return boards;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw new Error(
      `Error fetching boards: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
