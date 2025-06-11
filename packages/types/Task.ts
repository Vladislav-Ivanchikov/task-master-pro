import { User } from "./User";

export type TaskAssignee = {
  id: string;
  user: User;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  boardId: string;
  creatorId: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PENDING_REVIEW";
  assignees: TaskAssignee[];
  createdAt: Date;
  updatedAt: Date;
};
