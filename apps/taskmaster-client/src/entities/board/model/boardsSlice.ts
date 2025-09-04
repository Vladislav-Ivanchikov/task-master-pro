import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "@appTypes/Board.js";
import {
  createBoard,
  fetchBoardById,
  fetchBoards,
  removeBoard,
} from "../api/boardsThunks.js";

type BoardsState = {
  boards: Board[];
  selectedBoard: Board | null;
  loading: boolean;
  error: string | null;
};

const initialState: BoardsState = {
  boards: [],
  selectedBoard: null,
  loading: false,
  error: null,
};

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
        state.boards = action.payload;
        state.loading = false;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchBoardById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.selectedBoard = action.payload;
        state.loading = false;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch board";
      });

    builder
      .addCase(createBoard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.boards.push({
          ...action.payload,
          tasks: action.payload.tasks ?? [],
        });
        state.loading = false;
      })
      .addCase(createBoard.rejected, (state, action) => {
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
