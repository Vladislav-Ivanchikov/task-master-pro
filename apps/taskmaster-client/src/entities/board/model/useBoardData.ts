import { useEffect } from "react";
import { useAppDispatch } from "@shared/hooks/storeHooks.js";
import { fetchBoardById } from "@entities/board/api/boardsThunks.js";
import { fetchTasks } from "@entities/task/api/taskThunks.js";

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
