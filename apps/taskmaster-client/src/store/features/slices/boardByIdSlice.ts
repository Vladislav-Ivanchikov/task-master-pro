import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../../../../../../packages/types/Board";
import { RootState } from "store";

type BoardByIdState = {
  board: Board;
  loading: boolean;
  error: string | null;
};

const initialState: BoardByIdState = {
  board: {
    id: "",
    title: "",
    owner: {
      id: "",
      email: "",
      name: "",
      surname: "",
      role: "USER",
    },
    ownerId: "",
    description: "",
    tasks: [],
    members: [],
  },
  loading: true,
  error: null,
};

export const fetchBoardById = createAsyncThunk<
  Board,
  string,
  { state: RootState }
>("board/fetchBoardById", async (boardId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/boards/${boardId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
});

export const boardSlice = createSlice({
  name: "board",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(
      fetchBoardById.fulfilled,
      (state: BoardByIdState, action: PayloadAction<Board>) => {
        state.board = action.payload;
        state.loading = false;
        state.error = null;
      }
    );
    builder.addCase(fetchBoardById.rejected, (state: BoardByIdState) => {
      state.error = "Failed to fetch tasks";
      state.loading = false;
    });
    builder.addCase(fetchBoardById.pending, (state: BoardByIdState) => {
      state.loading = true;
      state.error = null;
    });
  },
  reducers: {},
});

export default boardSlice.reducer;
