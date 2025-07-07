import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTasks } from "../../store/features/slices/taskSlice";
import { fetchBoardById } from "../../store/features/slices/boardByIdSlice";
import { addBoardMember } from "../../store/features/slices/boardMembersSlice";
import CreateTaskModal from "../../components/TaskModal/CreateTaskModal";
import TaskCol from "../../components/TaskCol/TaskCol";
import Sidebar from "../../components/Sidebar/Sidebar";
import { User } from "../../../../../packages/types/User";
import { Loader, useToast } from "@taskmaster/ui-kit";
import styles from "./BoardPage.module.css";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { token, isInitialized, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const tasks = useAppSelector((state) => state.task.tasks);
  const board = useAppSelector((state) => state.board.board);
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const handleSelectUser = useCallback(
    async (user: User) => {
      if (board.members.some((u) => u.user.email === user.email)) {
        showToast({
          message: `${user.email} is already assigned to this board.`,
          type: "error",
        });
      } else {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/members`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ userId: user.id, role: user.role }),
            }
          );
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to add board member");
          }
          dispatch(addBoardMember(data));
          if (boardId) {
            dispatch(fetchBoardById(boardId));
          } else {
            console.error("Board ID is undefined");
          }

          showToast({
            message: `Board member "${data.name}" added successfully`,
            type: "success",
          });
        } catch (e: any) {
          showToast({
            message: e.message || "Failed to add board member",
            type: "error",
          });
          console.error("Failed to add board member:", e.message);
        }
      }
    },
    [boardId, token, board.members]
  );

  const handleRemoveMember = useCallback(
    async (user: User) => {
      if (boardId) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/members/${user.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to remove member");
          }
          showToast({
            message: `Member ${user.name} removed successfully`,
            type: "success",
          });
          dispatch(fetchBoardById(boardId));
        } catch (error: any) {
          console.error("Error removing board member:", error);
          showToast({
            message: error.message || "Failed to remove member",
            type: "error",
          });
        }
      } else {
        console.error("Board ID is undefined");
      }
    },
    [boardId, token]
  );

  const loadData = async () => {
    try {
      setIsLoading(true);
      if (isInitialized && token && user) {
        if (boardId) {
          await Promise.all([
            dispatch(fetchTasks(boardId)),
            dispatch(fetchBoardById(boardId)),
          ]);
        } else {
          console.error("Board ID is undefined");
        }
      } else {
        console.error("User is not initialized or token is missing");
      }
    } catch (e) {
      console.error("Error loading data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isInitialized, token, user, boardId]);

  useEffect(() => {
    if (board && user) setIsCreator(board.ownerId === user.id);
  }, [board, user]);

  if (!isInitialized || !board || isLoading) {
    return <Loader size="lg" />;
  }

  return (
    <div className={styles.boardContainer}>
      <Sidebar
        board={board}
        isCreator={isCreator}
        user={user}
        setIsModalOpen={setIsModalOpen}
        handleSelectUser={handleSelectUser}
        handleRemoveMember={handleRemoveMember}
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

      {isModalOpen && (
        <CreateTaskModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={async () => {
            if (boardId) {
              await dispatch(fetchTasks(boardId as string));
            } else {
              console.error("Board ID is undefined");
            }
          }}
          id={boardId as string}
        />
      )}
    </div>
  );
};

export default BoardPage;
