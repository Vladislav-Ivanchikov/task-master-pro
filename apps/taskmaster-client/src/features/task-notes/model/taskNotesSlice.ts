import { Note } from "@appTypes/Note.js";
import { createSlice } from "@reduxjs/toolkit";
import {
  createTaskNote,
  deleteTaskNote,
  fetchTaskNotes,
  updateTaskNote,
} from "@features/task-notes/api/taskNotesThunks.js";

interface TaskNotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskNotesState = {
  notes: [],
  loading: false,
  error: null,
};

const taskNotesSlice = createSlice({
  name: "taskNotes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTaskNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchTaskNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });

    builder
      .addCase(createTaskNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTaskNote.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createTaskNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });

    builder
      .addCase(updateTaskNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTaskNote.fulfilled, (state, action) => {
        state.notes = state.notes.map((note) => {
          if (note.id === action.payload.id) {
            return action.payload;
          }
          return note;
        });
        state.loading = false;
      })
      .addCase(updateTaskNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });

    builder
      .addCase(deleteTaskNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTaskNote.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteTaskNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  },
});

export default taskNotesSlice.reducer;
