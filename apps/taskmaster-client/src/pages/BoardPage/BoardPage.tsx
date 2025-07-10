import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBoardById } from "../../store/features/slices/boardByIdSlice";
import { fetchTasks } from "../../store/features/slices/taskSlice";
import { useBoardMembers } from "../../hooks/useBoardMembers";
import { useAuth } from "../../context/AuthContext";
import { useToast, Loader } from "@taskmaster/ui-kit";
import Sidebar from "../../components/Sidebar/Sidebar";
import TaskCol from "../../components/TaskCol/TaskCol";
import CreateTaskModal from "../../components/TaskModal/CreateTaskModal";
import styles from "./BoardPage.module.css";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { token, isInitialized, user } = useAuth();
  const { showToast } = useToast();

  const { addMember, removeMember } = useBoardMembers(boardId || "");
  const dispatch = useAppDispatch();

  const board = useAppSelector((state) => state.board.board);
  const boardLoading = useAppSelector((state) => state.board.loading);
  const boardError = useAppSelector((state) => state.board.error);

  const tasks = useAppSelector((state) => state.task.tasks);
  const taskLoading = useAppSelector((state) => state.task.loading);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLoading = boardLoading || taskLoading;

  const isCreator = useMemo(() => {
    return board?.ownerId === user?.id;
  }, [board?.ownerId, user?.id]);

  useEffect(() => {
    const loadBoardData = async () => {
      if (!boardId || !isInitialized || !token || !user) return;

      try {
        await Promise.all([
          dispatch(fetchBoardById(boardId)).unwrap(),
          dispatch(fetchTasks(boardId)).unwrap(),
        ]);
      } catch (err: any) {
        console.error("Ошибка при загрузке доски или задач", err);
        showToast({
          message: "Failed to load board or tasks",
          type: "error",
        });
      }
    };

    loadBoardData();
  }, [boardId, isInitialized, token, user]);

  if (!isInitialized || isLoading) {
    return <Loader size="lg" />;
  }

  if (boardError) {
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

      <div className={styles.mainContent}>
        <div className={styles.columns}>
          {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
            <TaskCol
              key={status}
              status={status}
              tasks={tasks}
              boardId={boardId}
              isCreator={isCreator}
            />
          ))}
        </div>

        <div className={styles.reviewColumn}>
          <TaskCol
            status="PENDING_REVIEW"
            tasks={tasks}
            boardId={boardId}
            isCreator={isCreator}
          />
        </div>
      </div>

      {/* modal управляется из Sidebar через setIsModalOpen */}
      {isModalOpen && (
        <CreateTaskModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={async () => {
            if (!boardId) return;
            try {
              await dispatch(fetchTasks(boardId)).unwrap();
            } catch (err) {
              console.error("Ошибка обновления задач после создания", err);
            }
          }}
          id={boardId!}
        />
      )}
    </div>
  );
};

export default BoardPage;
