import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../../../../../../packages/types/Board";

type BoardByIdState = {
  board: Board;
};

const initialState: BoardByIdState = {
  board: {
    id: "",
    title: "",
    owner: {
      id: "",
      email: "",
      name: "",
      surname: "",
      role: "USER",
    },
    ownerId: "",
    description: "",
    tasks: [],
    members: [],
  },
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<Board>) => {
      state.board = action.payload;
    },
  },
});

export const { setBoard } = boardSlice.actions;
export default boardSlice.reducer;
