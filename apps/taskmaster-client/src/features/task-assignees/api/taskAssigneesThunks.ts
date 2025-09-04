import { API_URL } from "@app/const.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addTaskAssignee = createAsyncThunk(
  "taskAssignees/add",
  async ({
    taskId,
    userId,
    token,
  }: {
    taskId: string;
    userId: string;
    token: string | null;
  }) => {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}/assignees`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Ошибка при назначении исполнителя");
    }
    return data;
  }
);

export const removeTaskAssignee = createAsyncThunk(
  "taskAssignees/remove",
  async ({
    taskId,
    userId,
    token,
  }: {
    taskId: string | undefined;
    userId: string;
    token: string | null;
  }) => {
    const response = await fetch(
      `${API_URL}/api/tasks/${taskId}/assignees/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Ошибка при удалении исполнителя");
    }
    return data;
  }
);
