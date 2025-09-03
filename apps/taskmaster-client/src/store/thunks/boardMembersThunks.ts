import { createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../../../../../packages/types/User.js";
import { API_URL } from "../../const.js";
import { getAuthHeaders } from "../features/getAuthHeaders.js";
import { AppDispatch, RootState } from "../index.js";
import { fetchBoardById } from "./boardsThunks.js";

type ThunkConfig = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
};

export const addBoardMemberThunk = createAsyncThunk<
  void,
  { boardId: string; user: User },
  ThunkConfig
>(
  "boardMembers/addBoardMember",
  async ({ boardId, user }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/api/boards/${boardId}/members`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: user.id, role: user.role }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add member");

      await dispatch(fetchBoardById(boardId));
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const removeBoardMemberThunk = createAsyncThunk<
  void,
  { boardId: string; userId: string },
  ThunkConfig
>(
  "boardMembers/removeBoardMember",
  async ({ boardId, userId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/api/boards/${boardId}/members/${userId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to remove board member");
      }
      await dispatch(fetchBoardById(boardId));
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
