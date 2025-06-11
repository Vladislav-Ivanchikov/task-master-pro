import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Task } from "../../../../../../packages/types/Task";
import { RootState } from "store";

type TaskState = {
  tasks: Task[];
  task: Task;
  isLoading: boolean;
  error: string | null;
};

const initialState: TaskState = {
  tasks: [],
  task: {} as Task,
  isLoading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk<
  Task[],
  string,
  { state: RootState }
>("task/fetchTasks", async (boardId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/tasks/board/${boardId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const data = await response.json();
    return data as Task[];
  } catch (error) {
    throw error;
  }
});

export const fetchTaskById = createAsyncThunk<
  Task,
  string,
  { state: RootState }
>("task/fetchTaskById", async (taskId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/tasks/task/${taskId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch task");
    }
    const data = await response.json();
    return data as Task;
  } catch (error) {
    throw error;
  }
});

const taskSlice = createSlice({
  name: "task",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state: TaskState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state: TaskState, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state: TaskState, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchTaskById.pending, (state: TaskState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state: TaskState, action) => {
        state.isLoading = false;
        state.task = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state: TaskState, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
  reducers: {},
});

export default taskSlice.reducer;
