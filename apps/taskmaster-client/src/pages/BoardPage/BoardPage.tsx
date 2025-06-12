import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { BoardMember } from "../../../../../packages/types/BoardMember";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTasks } from "../../store/features/slices/taskSlice";
import { addBoardMember } from "../../store/features/slices/boardMembersSlice";
import { fetchBoardById } from "../../store/features/slices/boardByIdSlice";
import CreateTaskModal from "../../components/TaskModal/CreateTaskModal";
import TaskCol from "../../components/TaskCol/TaskCol";
import UserSearch from "../../components/UserSearch/UserSearch";
import { Button } from "@taskmaster/ui-kit";
import styles from "./BoardPage.module.css";
import DraggableMember from "../../components/DraggableMember/DraggableMember";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { token, isInitialized, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tasks = useAppSelector((state) => state.task.tasks);
  const board = useAppSelector((state) => state.board.board);
  const dispatch = useAppDispatch();

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
      }
    };
    loadData();
  }, [isInitialized, token, user, boardId]);

  const handleSelectUser = useCallback(
    async (user: BoardMember) => {
      if (board.members.some((u) => u.email === user.email)) {
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
          dispatch(addBoardMember(data));
          if (boardId) {
            dispatch(fetchBoardById(boardId));
          } else {
            console.error("Board ID is undefined");
          }
        } catch (e) {
          console.error("Failed to add board member:", e);
        }
      }
    },
    [boardId, dispatch, token]
  );

  const handleRemoveMember = useCallback(
    async (userId: string) => {
      if (boardId) {
        await fetch(
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
      } else {
        console.error("Board ID is undefined");
      }
    },
    [boardId, dispatch, token]
  );

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  console.log(board);

  return (
    <div className={styles.boardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>{board.title}</h3>
          <Button
            onClick={() => setIsModalOpen(true)}
            className={styles.button}
          >
            Add New Task
          </Button>
        </div>

        <div className={styles.boardMembers}>
          <h4>{board.title} members:</h4>
          {user?.role === "ADMIN" && <UserSearch onSelect={handleSelectUser} />}
          <ul>
            {board.members.map((member) => (
              <li key={member.user.id}>
                <DraggableMember member={member} />
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
            />
          ))}
        </div>

        <div className={styles.reviewColumn}>
          <TaskCol status="PENDING_REVIEW" tasks={tasks} boardId={boardId} />
        </div>
      </main>

      {isModalOpen && (
        <CreateTaskModal onClose={() => setIsModalOpen(false)} id={boardId} />
      )}
    </div>
  );
};

export default BoardPage;
