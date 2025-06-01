import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoardMember } from "../../../../../../packages/types/BoardMember";

type BoardMembersState = {
  members: BoardMember[];
};

const initialState: BoardMembersState = {
  members: [],
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
