import { Role } from "@prisma/client";
import { prisma } from "../prisma/client";

export const createBoard = async (
  ownerId: string,
  title: string,
  description: string = ""
) => {
  if (!ownerId || !title?.trim()) {
    throw new Error("User ID and board name are required");
  }

  const owner = await prisma.user.findUnique({
    where: { id: ownerId },
  });

  if (!owner || owner.role !== Role.ADMIN) {
    throw new Error("User not found");
  }

  try {
    const board = await prisma.board.create({
      data: {
        title,
        description,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: Role.ADMIN,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
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

export const getBoardsByUser = async (
  userId: string,
  role: Role | undefined
) => {
  if (!userId || !role) {
    throw new Error("User ID and role is required");
  }

  if (role === Role.ADMIN) {
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
  } else if (role === Role.USER) {
    try {
      const boards = await prisma.board.findMany({
        where: {
          members: {
            some: {
              userId,
            },
          },
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
  }
};
