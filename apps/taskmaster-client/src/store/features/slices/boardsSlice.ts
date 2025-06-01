import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../../../../../../packages/types/Board";

type BoardsState = {
  boards: Board[];
};

const initialState: BoardsState = {
  boards: [],
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },
  },
});

export const { setBoards } = boardsSlice.actions;
export default boardsSlice.reducer;
