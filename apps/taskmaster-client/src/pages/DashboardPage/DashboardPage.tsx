import { Button, useToast } from "@taskmaster/ui-kit";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useAuth } from "../../context/AuthContext";
import { setBoards } from "../../store/features/slices/boardsSlice";
import CreateBoardModal from "../../components/BoardModal/CreateBoardModal";
import styles from "./DashboardPage.module.css";

const DashboardPage = () => {
  const { token } = useAuth();
  const boards = useAppSelector((state) => state.boards.boards);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/boards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch boards with tasks");
      }
      const data = await res.json();

      dispatch(setBoards(data));
    } catch (e) {
      console.error("Error fetching boards with tasks", e);
    }
  };

  const deleteBoard = async (id: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/boards/board/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete board");
      }
      showToast({
        message: `${data.message}`,
        type: "success",
      });
      fetchBoards();
    } catch (e: any) {
      console.error("Error deleting board", e);
      showToast({
        message: e.message || "Failed to delete board",
        type: "error",
      });
    }
  };

  return boards.length === 0 ? (
    <div>
      <h2>Dashboard</h2>
      <Button onClick={() => setIsModalOpen(true)}>Add First Board</Button>
      {isModalOpen && (
        <CreateBoardModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchBoards}
        />
      )}
    </div>
  ) : (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Dashboard</h2>
          <p className={styles.subtitle}>
            Welcome to your task management dashboard!
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Create Board</Button>
      </div>
      <div className={styles.boardList}>
        {boards.map((board) => {
          return (
            <div
              key={board.id}
              className={styles.boardCard}
              onClick={() => navigate("/boards/" + board.id)}
            >
              <h3>{board.title}</h3>
              <p>{board.description}</p>
              <p>{board.tasks.length} tasks</p>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  deleteBoard(board.id);
                }}
              >
                &times;
              </span>
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <CreateBoardModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchBoards}
        />
      )}
    </div>
  );
};

export default DashboardPage;
