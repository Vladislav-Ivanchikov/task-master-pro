import { Button } from "@taskmaster/ui-kit";
import CreateBoardModal from "../../components/BordModal/CreateBoardModal";
import { useEffect, useState } from "react";
import styles from "./DashboardPage.module.css";
import { useNavigate } from "react-router-dom";

type Board = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const DashbordPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boards, setBoards] = useState<Board[]>([]);
  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/boards`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        localStorage.removeItem("token");
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBoards(data);
    } catch (error) {
      console.error("Failed to fetch boards", error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

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
        {boards.map((board) => (
          <div
            key={board.id}
            className={styles.boardCard}
            onClick={() => navigate("/boards/" + board.id)}
          >
            <h3>{board.title}</h3>
            <p>{board.description}</p>
          </div>
        ))}
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

export default DashbordPage;
