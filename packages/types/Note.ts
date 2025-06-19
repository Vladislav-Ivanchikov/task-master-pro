export type Note = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
};
