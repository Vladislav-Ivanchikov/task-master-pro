import { prisma } from "../prisma/client";

export const createBoard = async (userId: string, name: string) => {
  try {
    const board = await prisma.board.create({
      data: {
        name,
        ownerId: userId,
      },
    });
    return board;
  } catch (error) {
    throw new Error("Error creating board");
  }
};

export const getBoardsByUser = async (userId: string) => {
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
    throw new Error("Error fetching boards");
  }
};
