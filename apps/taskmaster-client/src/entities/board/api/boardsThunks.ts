import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuthHeaders } from "@shared/lib/getAuthHeaders.js";
import { Board } from "@appTypes/Board.js";
import { RootState } from "@app/store/index.js";
import { API_URL } from "@app/const.js";

export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/boards`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }
      const data = await response.json();
      return data as Board[];
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const fetchBoardById = createAsyncThunk<
  Board,
  string,
  { state: RootState }
>("board/fetchBoardById", async (boardId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/boards/${boardId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
});

export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async (
    { title, description }: { title: string; description: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${API_URL}/api/boards/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create board");
      }

      const data = await response.json();
      return data as Board;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);

export const removeBoard = createAsyncThunk(
  "boards/removeBoard",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(`${API_URL}/api/boards/board/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete board");
      }

      dispatch(fetchBoards());
      return { id, message: data.message };
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  }
);
