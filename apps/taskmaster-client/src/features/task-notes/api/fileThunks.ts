import { API_URL } from "@app/const.js";
import { RootState } from "@app/store/index.js";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkResponse } from "./taskNotesThunks.js";

export const uploadFile = createAsyncThunk<
  { id: string; name: string },
  { taskId: string | undefined; file: File; token: string | null },
  { state: RootState }
>("files/uploadFile", async ({ taskId, file, token }, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/files/${taskId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    await checkResponse(res, "Failed to upload file");
    return await res.json();
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

export const deleteFile = createAsyncThunk<
  void,
  { fileId: string; token: string | null },
  { state: RootState }
>("files/delete", async ({ fileId, token }) => {
  const res = await fetch(`${API_URL}/api/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete file");
  }
  await checkResponse(res, "Failed to delete file");
});

export const getPresignedUrl = createAsyncThunk<
  string,
  { fileId: string; token: string | null },
  { state: RootState }
>("files/getPresignedUrl", async ({ fileId, token }) => {
  const res = await fetch(`${API_URL}/api/files/${fileId}/presigned`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await checkResponse(res, "Failed to get presigned url");
  const data = await res.json();
  return data.url;
});
