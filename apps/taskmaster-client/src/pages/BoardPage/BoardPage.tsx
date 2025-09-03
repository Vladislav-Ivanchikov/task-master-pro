import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/features/hooks.js";
import { fetchTasks } from "../../store/thunks/taskThunks.js";
import { useBoardData } from "../../hooks/useBoardData.js";
import { useBoardMembers } from "../../hooks/useBoardMembers.js";
import { useAuth } from "../../context/AuthContext.js";
import { Board } from "../../../../../packages/types/Board.js";
import { Task } from "../../../../../packages/types/Task.js";
import { useToast, Loader } from "@taskmaster/ui-kit";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import CreateTaskModal from "../../components/TaskModal/CreateTaskModal.js";
import BoardTaskContent from "../../components/BoardTaskContent/BoardTaskContent.js";
import styles from "./BoardPage.module.css";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { token, isInitialized, user } = useAuth();
  const { showToast } = useToast();

  const { addMember, removeMember } = useBoardMembers();
  const dispatch = useAppDispatch();

  const board = useAppSelector<Board | null>(
    (state) => state.boards.selectedBoard
  );
  const boardLoading = useAppSelector((state) => state.boards.loading);
  const boardError = useAppSelector((state) => state.boards.error);

  const tasks = useAppSelector<Task[]>((state) => state.task.tasks);
  const taskLoading = useAppSelector((state) => state.task.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoading = boardLoading || taskLoading;
  const isCreator = board?.ownerId === user?.id;

  useBoardData(boardId, isInitialized, token, user?.id, (msg) =>
    showToast({ message: msg, type: "error" })
  );

  const handleSuccess = async (): Promise<void> => {
    if (!boardId) return;
    try {
      await dispatch(fetchTasks(boardId)).unwrap();
    } catch (err) {
      console.error("Ошибка обновления задач после создания", err);
    }
  };

  if (!isInitialized || isLoading) {
    return <Loader size="lg" />;
  }

  if (boardError || !boardId) {
    return <p className={styles.error}>Error loading board: {boardError}</p>;
  }

  return (
    <div className={styles.boardContainer}>
      <Sidebar
        board={board}
        isCreator={isCreator}
        user={user}
        setIsModalOpen={setIsModalOpen}
        handleSelectUser={addMember}
        handleRemoveMember={(user) => removeMember(user.id, user.name)}
      />

      <BoardTaskContent
        boardId={boardId}
        tasks={tasks}
        isCreator={isCreator}
        styles={styles}
      />

      {isModalOpen && (
        <CreateTaskModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
          id={boardId}
        />
      )}
    </div>
  );
};

export default BoardPage;
