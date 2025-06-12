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

  if (!owner) {
    throw new Error("User not found");
  }

  try {
    const board = await prisma.board.create({
      data: {
        title,
        description,
        ownerId,
        members: {
          create: [{ userId: ownerId, role: "ADMIN" }],
        },
      },
      include: {
        members: true,
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

export const deleteBoard = async (boardId: string, currentUserId: string) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { members: true },
  });

  if (!board) throw new Error("Board not found");

  if (board.ownerId !== currentUserId) {
    throw new Error("Only board owner can delete the board");
  }

  if (board.members.length > 1) {
    throw new Error("Cannot delete board with other members present");
  }

  await prisma.boardMember.deleteMany({ where: { boardId } });
  await prisma.board.delete({ where: { id: boardId } });

  return { message: "Board deleted successfully" };
};

export const getBoardsByUser = async (
  userId: string,
  role: Role | undefined
) => {
  if (!userId || !role) {
    throw new Error("User ID and role is required");
  }

  try {
    const boards = await prisma.board.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        tasks: true,
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

export const getBoardById = async (boardId: string) => {
  if (!boardId) {
    throw new Error("Board ID is required");
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
            surname: true,
            role: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                role: true,
              },
            },
          },
        },
      },
    });
    if (!board) throw new Error("Board not found");
    return board;
  } catch (error) {
    console.error("Error fetching board:", error);
    throw new Error(
      `Error fetching board: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};

export const addBoardMember = async (
  userId: string,
  boardId: string,
  role: Role
) => {
  try {
    const board = await prisma.board.findUnique({ where: { id: boardId } });
    if (!board) throw new Error("Board doesnt exist");

    const existing = await prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId,
          boardId,
        },
      },
    });
    if (existing) {
      console.error("User already a member");
      throw new Error("User already a member");
    }

    const newMember = await prisma.boardMember.create({
      data: {
        boardId,
        userId,
        role: role ?? "USER",
      },
      include: {
        user: true,
      },
    });

    return {
      name: newMember.user.name,
      email: newMember.user.email,
      avatarUrl: newMember.user.avatarUrl,
      role: newMember.role,
    };
  } catch (e) {
    console.error("Adding users failed");
    throw new Error("Adding users failed");
  }
};

export const removeBoardMember = async (
  boardId: string,
  targetUserId: string,
  currentUserId: string
) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: { members: true },
  });

  if (!board) throw new Error("Board not found");

  if (board.ownerId !== currentUserId) {
    throw new Error("Only board owner can remove members");
  }

  if (targetUserId === board.ownerId) {
    throw new Error("Cannot remove board owner");
  }

  const existingMember = board.members.find((m) => m.userId === targetUserId);
  console.log(board.members);
  console.log(existingMember);
  if (!existingMember) {
    throw new Error("User is not a member of the board");
  }

  console.log(targetUserId);

  await prisma.boardMember.delete({
    where: {
      userId_boardId: {
        userId: targetUserId,
        boardId,
      },
    },
  });

  return { message: "Member removed successfully" };
};
