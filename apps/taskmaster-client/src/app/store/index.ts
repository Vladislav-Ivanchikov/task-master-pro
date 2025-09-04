import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "@entities/task/model/taskSlice.js";
import boardsReducer from "@entities/board/model/boardsSlice.js";
import boardsMembersReduser from "@features/board-members/model/boardMembersSlice.js";
import taskAssigneesReduser from "@features/task-assignees/model/taskAssigneesSlice.js";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    boards: boardsReducer,
    boardMembers: boardsMembersReduser,
    taskAssignees: taskAssigneesReduser,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
