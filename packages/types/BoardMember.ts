import { User } from "./User";

export type BoardMember = {
  id: string; // ID записи BoardMember
  userId: string; // ID пользователя
  boardId: string; // ID доски
  role: "USER" | "ADMIN";
  name: string;
  surname: string;
  user: User;
  email: string;
};
