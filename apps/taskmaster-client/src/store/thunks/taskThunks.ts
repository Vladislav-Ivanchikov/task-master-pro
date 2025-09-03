import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "../../const.js";
import { Task, TaskStatus } from "../../../../../packages/types/Task.js";
import { RootState } from "../index.js";

export const fetchTasks = createAsyncThunk<
  Task[],
  string,
  { state: RootState }
>("task/fetchTasks", async (boardId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/tasks/board/${boardId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const data = await response.json();
    return data as Task[];
  } catch (error) {
    throw error;
  }
});

export const fetchTaskById = createAsyncThunk<
  Task,
  string,
  { state: RootState }
>("task/fetchTaskById", async (taskId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/tasks/task/${taskId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch task");
    }
    const data = await response.json();
    return data as Task;
  } catch (error) {
    throw error;
  }
});

export const createTask = createAsyncThunk<
  Task,
  {
    boardId: string;
    title: string;
    description: string;
    status: TaskStatus;
  },
  { state: RootState }
>("task/createTask", async ({ boardId, title, description, status }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/tasks/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ boardId, title, description, status }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to create task");
  }
  return await response.json();
});

export const updateTaskStatus = createAsyncThunk<
  Task,
  { taskId: string; status: TaskStatus },
  { state: RootState }
>("task/updateStatus", async ({ taskId, status }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to update status");
  }
  return await response.json();
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { state: RootState }
>("task/deleteTask", async (taskId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/tasks/task/${taskId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete task");
  }
  return taskId;
});
