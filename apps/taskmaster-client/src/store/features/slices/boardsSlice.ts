import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../../../../../../packages/types/Board";
import { getAuthHeaders } from "../../getAuthHeaders";

type BoardsState = {
  boards: Board[];
  loading: boolean;
  error: string | null;
};

const initialState: BoardsState = {
  boards: [],
  loading: false,
  error: null,
};

export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/boards`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
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

export const removeBoard = createAsyncThunk(
  "boards/removeBoard",
  async (id: string, thunkAPI) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/boards/board/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete board");
      }
      const data = await response.json();
      thunkAPI.dispatch(fetchBoards());
      return { id, message: data.message };
    } catch (e) {
      console.error("Error deleting board", e);
    }
  }
);

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(removeBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((b) => b.id !== action.payload?.id);
        state.error = null;
        state.loading = false;
      })
      .addCase(removeBoard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBoards } = boardsSlice.actions;
export default boardsSlice.reducer;
