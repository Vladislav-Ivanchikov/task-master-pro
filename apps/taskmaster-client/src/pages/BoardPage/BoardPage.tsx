import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@taskmaster/ui-kit";
import styles from "./BoardPage.module.css";
import CreateTaskModal from "../../components/TaskModal/CreateTaskModal";

type Task = {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

const BoardPage = () => {
  const { token, isInitialized, user } = useAuth();
  const { boardId } = useParams<{ boardId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${boardId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (isInitialized && token && user) {
      fetchTasks();
    }
  }, [isInitialized, token, user]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.sidebar}>
        <h3>Board ID: {boardId}</h3>
        {user?.role === "ADMIN" && (
          <Button onClick={() => setIsModalOpen(true)}>Add New Task</Button>
        )}
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
          onSuccess={fetchTasks}
          id={boardId}
        />
      )}
    </div>
  );
};

export default BoardPage;
