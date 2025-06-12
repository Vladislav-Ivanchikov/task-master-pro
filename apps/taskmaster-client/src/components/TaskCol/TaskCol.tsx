import { useNavigate } from "react-router-dom";
import styles from "../../pages/BoardPage/BoardPage.module.css";
import TaskCard from "../../components/TaskCard/TaskCard";
import { Task } from "../../../../../packages/types/Task";
import { useAuth } from "../../context/AuthContext";

interface ColumnProps {
  boardId: string | undefined;
  status: string;
  tasks: Task[];
}

const TaskCol: React.FC<ColumnProps> = ({ status, tasks, boardId }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const filtered = tasks.filter((t) => t.status === status);

  const getLabel = (status: string) => {
    switch (status) {
      case "TODO":
        return "📋 To Do";
      case "IN_PROGRESS":
        return "🚧 In Progress";
      case "DONE":
        return "✅ Done";
      case "PENDING_REVIEW":
        return "🕵️ Review";
      default:
        return status;
    }
  };

  const addAssignee = async (taskId: string, userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/assignees`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 409) {
          throw new Error("Этот пользователь уже назначен");
        } else if (response.status === 404) {
          throw new Error("Задача не найдена");
        } else {
          throw new Error(data.message || "Неизвестная ошибка");
        }
      }
      alert("Assignee added successfully");
    } catch (error: any) {
      console.error("Error adding assignee:", error);
      alert(error.message);
      throw error;
    }
  };

  return (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>{getLabel(status)}</h3>
      {filtered.map((task) => (
        <TaskCard
          task={task}
          key={task.id}
          onAssignMember={addAssignee}
          boardId={boardId}
        />
      ))}
    </div>
  );
};

export default TaskCol;
