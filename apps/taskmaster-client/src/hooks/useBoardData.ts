import { useEffect } from "react";
import { useAppDispatch } from "../store/features/hooks.js";
import { fetchBoardById } from "../store/thunks/boardsThunks.js";
import { fetchTasks } from "../store/thunks/taskThunks.js";

export const useBoardData = (
  boardId: string | undefined,
  isInitialized: boolean,
  token: string | null,
  userId: string | undefined,
  onError: (message: string) => void
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!boardId || !isInitialized || !token || !userId) return;

    const load = async () => {
      try {
        await Promise.all([
          dispatch(fetchBoardById(boardId)).unwrap(),
          dispatch(fetchTasks(boardId)).unwrap(),
        ]);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        onError(message);
      }
    };

    load();
  }, [boardId, isInitialized, token, userId]);
};
