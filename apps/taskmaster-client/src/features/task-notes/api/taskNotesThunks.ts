import { API_URL } from "@app/const.js";
import { RootState } from "@app/store/index.js";
import { Note } from "@appTypes/Note.js";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const checkResponse = async (res: Response, defaultMessage: string) => {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || defaultMessage);
  }
};

export const fetchTaskNotes = createAsyncThunk<
  Note[],
  { taskId: string | undefined; token: string | null },
  { state: RootState }
>("taskNotes/fetchNotes", async ({ taskId, token }) => {
  try {
    const res = await fetch(`${API_URL}/api/tasks/${taskId}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await checkResponse(res, "Failed to fetch notes");
    return await res.json();
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const createTaskNote = createAsyncThunk<
  Note,
  {
    taskId: string | undefined;
    content: string;
    token: string | null;
    fileId?: string;
  },
  { state: RootState }
>(
  "taskNotes/createNote",
  async ({ taskId, content, token, fileId }, thunkAPI) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          ...(fileId ? { fileId } : {}),
        }),
      });
      await checkResponse(res, "Failed to create note");
      thunkAPI.dispatch(fetchTaskNotes({ taskId, token }));
      return await res.json();
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
);

export const updateTaskNote = createAsyncThunk<
  Note,
  {
    id: string;
    taskId: string | undefined;
    editContent: string;
    token: string | null;
  },
  { state: RootState }
>("taskNotes/updateNote", async ({ id, taskId, editContent, token }) => {
  try {
    const res = await fetch(`${API_URL}/api/tasks/${taskId}/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: editContent }),
    });

    await checkResponse(res, "Failed to update note");
    return await res.json();
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const deleteTaskNote = createAsyncThunk<
  { id: string },
  { id: string; taskId: string | undefined; token: string | null },
  { state: RootState }
>("taskNotes/deleteNote", async ({ id, taskId, token }, thunkAPI) => {
  const res = await fetch(`${API_URL}/api/tasks/${taskId}/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  await checkResponse(res, "Failed to delete note");

  thunkAPI.dispatch(fetchTaskNotes({ taskId, token }));

  if (res.status === 204) {
    return { id };
  }

  return await res.json();
});
