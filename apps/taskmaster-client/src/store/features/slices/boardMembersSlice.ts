import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardMember } from "../../../../../../packages/types/BoardMember";
import { User } from "../../../../../../packages/types/User";
import { fetchBoardById } from "./boardByIdSlice";
import { AppDispatch, RootState } from "store";
import { getAuthHeaders } from "../../getAuthHeaders";

type BoardMembersState = {
  members: BoardMember[];
  loading: boolean;
  error: string | null;
};

const initialState: BoardMembersState = {
  members: [],
  loading: true,
  error: null,
};

type ThunkConfig = {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
};

const API = import.meta.env.VITE_API_URL;

export const addBoardMemberThunk = createAsyncThunk<
  void,
  { boardId: string; user: User },
  ThunkConfig
>(
  "boardMembers/addBoardMember",
  async ({ boardId, user }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch(`${API}/api/boards/${boardId}/members`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ userId: user.id, role: user.role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to add board member");
      }

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
        `${API}/api/boards/${boardId}/members/${userId}`,
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

const boardMembersSlice = createSlice({
  name: "boardMembers",
  initialState,
  reducers: {
    setBoardMembers(state, action: PayloadAction<BoardMember[]>) {
      state.members = action.payload;
    },
    addBoardMember(state, action: PayloadAction<BoardMember>) {
      state.members.push(action.payload);
    },
    removeBoardMember(state, action: PayloadAction<string>) {
      state.members = state.members.filter((m) => m.id !== action.payload);
    },
  },
});

export const { setBoardMembers, addBoardMember, removeBoardMember } =
  boardMembersSlice.actions;

export default boardMembersSlice.reducer;
