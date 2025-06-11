import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "../../../../../../packages/types/Board";
import { RootState } from "store";

type BoardByIdState = {
  board: Board;
  isLoading: boolean;
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
  isLoading: false,
  error: null,
};

export const fetchBoardById = createAsyncThunk<
  Board,
  string,
  { state: RootState }
>("board/fetchBoardById", async (boardId) => {
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
      }
    );
    builder.addCase(fetchBoardById.rejected, (state: BoardByIdState) => {});
    builder.addCase(fetchBoardById.pending, (state: BoardByIdState) => {});
  },
  reducers: {},
});

export default boardSlice.reducer;
