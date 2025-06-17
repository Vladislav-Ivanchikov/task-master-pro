import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTasks } from "../../store/features/slices/taskSlice";
import { addBoardMember } from "../../store/features/slices/boardMembersSlice";
import { fetchBoardById } from "../../store/features/slices/boardByIdSlice";
import CreateTaskModal from "../../components/TaskModal/CreateTaskModal";
import TaskCol from "../../components/TaskCol/TaskCol";
import UserSearch from "../../components/UserSearch/UserSearch";
import DraggableMember from "../../components/DraggableMember/DraggableMember";
import { BoardMember } from "../../../../../packages/types/BoardMember";
import { Button, useToast } from "@taskmaster/ui-kit";
import styles from "./BoardPage.module.css";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { token, isInitialized, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const tasks = useAppSelector((state) => state.task.tasks);
  const board = useAppSelector((state) => state.board.board);

  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    const loadData = async () => {
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
    };
    loadData();
  }, [isInitialized, token, user, boardId]);

  useEffect(() => {
    if (board && user) setIsCreator(board.ownerId === user.id);
  }, [board, user]);

  const handleSelectUser = useCallback(
    async (user: { id: string; name: string; email: string; role: string }) => {
      if (board.members.some((u) => u.user.email === user.email)) {
        alert(`${user.email} is already assigned to this board.`);
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
    [boardId, dispatch, token]
  );

  const handleRemoveMember = useCallback(
    async (userId: string) => {
      if (boardId) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/boards/${boardId}/members/${userId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          dispatch(fetchBoardById(boardId));
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to remove member");
          }
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
    [boardId, dispatch, token]
  );

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>{board.title}</h3>

          {isCreator && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className={styles.button}
            >
              Add New Task
            </Button>
          )}
        </div>

        <div className={styles.boardMembers}>
          <h4>{board.title} members:</h4>
          {user?.role === "ADMIN" && <UserSearch onSelect={handleSelectUser} />}
          <ul>
            {board.members.map((member) => (
              <li key={member.user.id}>
                <DraggableMember member={member} isCreator={isCreator} />
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveMember(member.user.id)}
                >
                  {"x"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <main className={styles.mainContent}>
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
      </main>

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
