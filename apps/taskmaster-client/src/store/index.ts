import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./features/slices/taskSlice";
import boardsReducer from "./features/slices/boardsSlice";
import boardsMembersReduser from "./features/slices/boardMembersSlice";
import boardByIdReduser from "./features/slices/boardByIdSlice";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    boards: boardsReducer,
    boardMembers: boardsMembersReduser,
    board: boardByIdReduser,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
