import { User } from "./User";

export type TaskAssignee = {
  id: string;
  user: User;
};

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_REVIEW = "PENDING_REVIEW",
  DONE = "DONE",
}

export type Task = {
  id: string;
  title: string;
  description: string;
  boardId: string;
  creatorId: string;
  status: TaskStatus;
  assignees: TaskAssignee[];
  createdAt: Date;
  updatedAt: Date;
};
