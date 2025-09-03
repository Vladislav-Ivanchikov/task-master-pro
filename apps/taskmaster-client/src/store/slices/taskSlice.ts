import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../../../../../packages/types/Task.js";
import {
  createTask,
  deleteTask,
  fetchTaskById,
  fetchTasks,
  updateTaskStatus,
} from "../thunks/taskThunks.js";

type TaskState = {
  tasks: Task[];
  task: Task | null;
  loading: boolean;
  error: string | null;
};

const initialState: TaskState = {
  tasks: [],
  task: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  extraReducers: (builder) => {
    // all tasks
    builder
      .addCase(fetchTasks.pending, (state: TaskState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state: TaskState, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state: TaskState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // single task
    builder
      .addCase(fetchTaskById.pending, (state: TaskState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state: TaskState, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.task = null;
        state.error = action.payload as string;
      });

    // create task
    builder
      .addCase(createTask.pending, (state: TaskState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state: TaskState, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state: TaskState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // update task status
    builder
      .addCase(updateTaskStatus.pending, (state: TaskState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const taskInList = state.tasks.find((t) => t.id === updated.id);
        if (taskInList) taskInList.status = updated.status;
        if (state.task?.id === updated.id) state.task = updated;
      })
      .addCase(updateTaskStatus.rejected, (state: TaskState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // delete task
    builder
      .addCase(deleteTask.pending, (state: TaskState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state: TaskState, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state: TaskState, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  reducers: {},
});

export default taskSlice.reducer;
