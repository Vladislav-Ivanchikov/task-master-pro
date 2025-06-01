import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { BoardMember } from "../../../../../packages/types/BoardMember";
import { fetchTasks } from "../../store/features/slices/taskSlice";
import { addBoardMember } from "../../store/features/slices/boardMembersSlice";
import { setBoard } from "../../store/features/slices/boardByIdSlice";
import CreateTaskModal from "../../components/TaskModal/CreateTaskModal";
import UserSearch from "../../components/UserSearch/UserSearch";
import { Button } from "@taskmaster/ui-kit";
import styles from "./BoardPage.module.css";

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const { token, isInitialized, user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tasks = useAppSelector((state) => state.task.task);
  const boardMembers = useAppSelector((state) => state.boardMembers.members);
  const board = useAppSelector((state) => state.board.board);
  const dispatch = useAppDispatch();

  const handleSelectUser = async (user: BoardMember) => {
    if (boardMembers.some((u) => u.email === user.email)) {
      alert(`${user.email} is already assigned to this board.`);
    } else {
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
    }
  };

  const fetchBoard = async (boardId: string | undefined) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/boards/${boardId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      dispatch(setBoard(data));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (isInitialized && token && user) {
      if (boardId) {
        dispatch(fetchTasks(boardId));
        fetchBoard(boardId);
      } else {
        console.error("Board ID is undefined");
      }
    }
  }, [isInitialized, token, user, boardId]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.sidebar}>
        <h3>Board: {board.title}</h3>
        {user?.role === "ADMIN" && (
          <>
            <UserSearch
              onSelect={handleSelectUser}
              onSuccess={() => fetchBoard(boardId)}
            />
          </>
        )}
        <div>
          <h4>Board members:</h4>
          <ul>
            {board.members.map((member) => (
              <li key={member.user.email}>
                {member.user.name + " " + member.user.surname} (
                {member.user.email})
              </li>
            ))}
          </ul>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add New Task</Button>
      </div>

      <div className={styles.columns}>
        {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
          <div key={status} className={styles.column}>
            <h3>{status.replace("_", " ")}</h3>
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <div key={task.id} className={styles.taskCard}>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
              ))}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CreateTaskModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={async () => {
            if (boardId) {
              await dispatch(fetchTasks(boardId));
            }
          }}
          id={boardId}
        />
      )}
    </div>
  );
};

export default BoardPage;
