export type User = {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: "USER" | "ADMIN";
  createdAt?: Date;
  updatedAt?: Date;
};
