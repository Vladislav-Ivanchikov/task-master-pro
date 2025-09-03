import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./slices/taskSlice.js";
import boardsReducer from "./slices/boardsSlice.js";
import boardsMembersReduser from "./slices/boardMembersSlice.js";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    boards: boardsReducer,
    boardMembers: boardsMembersReduser,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
