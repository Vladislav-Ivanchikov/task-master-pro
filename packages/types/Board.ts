import { BoardMember } from "./BoardMember";
import { Task } from "./Task";
import { User } from "./User";

export type Board = {
  id: string;
  title: string;
  owner: User;
  ownerId: string;
  description: string;
  tasks: Task[];
  members: BoardMember[];
};
