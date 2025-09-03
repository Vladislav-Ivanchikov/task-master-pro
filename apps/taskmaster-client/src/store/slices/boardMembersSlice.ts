import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardMember } from "../../../../../packages/types/BoardMember.js";

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
