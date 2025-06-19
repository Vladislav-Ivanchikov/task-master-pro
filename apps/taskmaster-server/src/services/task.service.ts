import { TaskStatus } from "@prisma/client";
import { prisma } from "../prisma/client";
import e from "express";

interface TaskInput {
  boardId: string;
  title: string;
  description: string;
  status?: "TODO" | "IN_PROGRESS" | "DONE" | "PENDING_REVIEW";
  creatorId: string;
}

export const createTask = async ({
  boardId,
  title,
  description,
  creatorId,
  status = "TODO",
}: TaskInput) => {
  try {
    const board = await prisma.board.findFirst({
      where: {
        id: boardId,
        members: {
          some: {
            userId: creatorId,
          },
        },
      },
    });

    if (creatorId !== board?.ownerId) {
      throw new Error("Only board owner can create tasks");
    }

    if (!board) {
      throw new Error("User is not a member of the board");
    }
    const task = await prisma.task.create({
      data: {
        title: title || "Untitled Task",
        description,
        status,
        boardId,
        creatorId,
        assignees: {
          create: {
            userId: creatorId,
          },
        },
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
      assignees: {
        select: {
          id: true,
          user: true,
        },
      },
    },
  });
};

export const addTaskAssignee = async (taskId: string, userId: string) => {
  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      throw new Error("Task not found");
    }

    const existing = await prisma.taskAssignee.findUnique({
      where: {
        taskId_userId: {
          taskId,
          userId,
        },
      },
    });

    if (existing) {
      throw new Error("Assignee already exists");
    }

    const assignee = await prisma.taskAssignee.create({
      data: {
        taskId,
        userId,
      },
      include: {
        user: true,
        task: true,
      },
    });

    return assignee;
  } catch (error: any) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
};

export const getTask = async (taskId: string) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: {
          include: {
            user: true,
          },
        },
      },
    });

    return task;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new Error("Failed to fetch task");
  }
};

export const updateTaskStatus = async (
  taskId: string,
  newStatus: TaskStatus,
  currentUserId: string
) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: true,
        board: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!task) throw new Error("Task not found");

    const isAssignee = task.assignees.some((a) => a.userId === currentUserId);
    const isBoardOwner = task.board.ownerId === currentUserId;

    const currentStatus = task.status;

    const allowed =
      (currentStatus === "TODO" && newStatus === "IN_PROGRESS" && isAssignee) ||
      (currentStatus === "IN_PROGRESS" &&
        newStatus === "PENDING_REVIEW" &&
        isAssignee) ||
      (currentStatus === "PENDING_REVIEW" &&
        (newStatus === "DONE" || newStatus === "IN_PROGRESS") &&
        isBoardOwner);

    if (!allowed) {
      throw new Error("You don't have permission to change the task status");
    }

    return await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
      },
    });
  } catch (error: any) {
    console.error("Error updating task status:", error);
    throw new Error(error.message || "Failed to update task status");
  }
};

export const removeTaskAssignee = async (
  taskId: string,
  userIdToRemove: string,
  currentUserId: string
) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: true,
        board: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!task) throw new Error("Task not found");

    const isOwner = task.board.ownerId === currentUserId;
    if (!isOwner) throw new Error("Only board owner can remove assignees");

    if (task.status === "IN_PROGRESS") {
      throw new Error("Cannot remove assignees while task is IN_PROGRESS");
    }

    if (userIdToRemove === task.board.ownerId) {
      throw new Error("Cannot remove board owner from the task");
    }

    const assigneeExists = task.assignees.find(
      (a) => a.userId === userIdToRemove
    );
    if (!assigneeExists) {
      throw new Error("User is not assigned to this task");
    }

    await prisma.taskAssignee.deleteMany({
      where: {
        taskId,
        userId: userIdToRemove,
      },
    });

    return { message: "Assignee removed successfully" };
  } catch (error: any) {
    console.error("Error removing task assignee:", error);
    throw new Error(error.message || "Failed to remove task assignee");
  }
};

export const deleteTask = async (taskId: string, currentUserId: string) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: true,
        board: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!task) throw new Error("Task not found");

    const isOwner = task.board.ownerId === currentUserId;
    if (!isOwner) throw new Error("Only board owner can delete the task");

    if (
      task.assignees.length !== 1 ||
      task.assignees[0].userId !== task.board.ownerId
    ) {
      throw new Error(
        "Task can only be deleted if the only assignee is the board owner"
      );
    }

    await prisma.taskAssignee.deleteMany({ where: { taskId } });
    await prisma.task.delete({ where: { id: taskId } });

    return { message: "Task deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting task:", error);
    throw new Error(error.message || "Failed to delete task");
  }
};

export const createNote = async (
  taskId: string,
  content: string,
  userId: string
) => {
  try {
    const isAssignee = await prisma.taskAssignee.findFirst({
      where: {
        taskId,
        userId,
      },
    });

    if (!isAssignee) {
      throw new Error("User is not an assignee of this task");
    }
    const note = await prisma.taskNote.create({
      data: {
        content,
        taskId,
        authorId: userId!,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    return note;
  } catch (error: any) {
    console.error("Error creating note:", error);
    throw new Error(error.message || "Failed to create note");
  }
};

export const getNotesByTask = async (taskId: string, userId: string) => {
  try {
    // const isAssignee = await prisma.taskAssignee.findFirst({
    //   where: {
    //     taskId,
    //     userId,
    //   },
    // });

    // if (!isAssignee) {
    //   throw new Error("User is not an assignee of this task");
    // }
    const notes = await prisma.taskNote.findMany({
      where: { taskId },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return notes;
  } catch (error: any) {
    console.error("Error fetching notes:", error);
    throw new Error(error.message || "Failed to fetch notes");
  }
};

export const updateNote = async (
  noteId: string,
  content: string,
  userId: string
) => {
  const existingNote = await prisma.taskNote.findUnique({
    where: { id: noteId },
  });

  if (!existingNote || existingNote.authorId !== userId) {
    throw new Error("You can only update your own notes");
  }

  const updatedNote = await prisma.taskNote.update({
    where: { id: noteId },
    data: { content },
  });

  return updatedNote;
};

export const deleteNote = async (noteId: string, userId: string) => {
  try {
    const existingNote = await prisma.taskNote.findUnique({
      where: { id: noteId },
    });

    if (!existingNote || existingNote.authorId !== userId) {
      throw new Error("You can only delete your own notes");
    }

    await prisma.taskNote.delete({ where: { id: noteId } });

    return { message: "Note deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting note:", error);
    throw new Error(error.message || "Failed to delete note");
  }
};
