import { createSlice } from "@reduxjs/toolkit";
import {
  addTaskAssignee,
  removeTaskAssignee,
} from "../api/taskAssigneesThunks.js";

interface TaskAssigneesState {
  loading: boolean;
  error: string | null;
}

const initialState: TaskAssigneesState = {
  loading: false,
  error: null,
};

const taskAssigneesSlice = createSlice({
  name: "taskAssignees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTaskAssignee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAssignee.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTaskAssignee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(removeTaskAssignee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTaskAssignee.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeTaskAssignee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default taskAssigneesSlice.reducer;
