import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Task } from "../../../../../../packages/types/Task";
import { RootState } from "store";

type TaskState = {
  task: Task[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TaskState = {
  task: [],
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
      `${import.meta.env.VITE_API_URL}/api/tasks/${boardId}`,
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
        state.task = action.payload;
      })
      .addCase(fetchTasks.rejected, (state: TaskState, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
  reducers: {},
});

export default taskSlice.reducer;
