export type Task = {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE" | "PENDING_REVIEW";
  assignedUsers: {
    email: string;
    name: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
};
