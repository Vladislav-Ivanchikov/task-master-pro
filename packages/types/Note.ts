export type Note = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  file: {
    id: string;
    name: string;
    url: string;
    uploaderId: string;
    createdAt: string;
    taskId: string;
  };
};
