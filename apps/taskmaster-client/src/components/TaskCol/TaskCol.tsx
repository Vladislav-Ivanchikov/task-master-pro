import styles from "../../pages/BoardPage/BoardPage.module.css";
import TaskCard from "../../components/TaskCard/TaskCard";
import { Task } from "../../../../../packages/types/Task";
import { useAuth } from "../../context/AuthContext";
import { getLabel } from "../../utils/getLabel";
import { useToast } from "@taskmaster/ui-kit";

interface ColumnProps {
  boardId: string | undefined;
  status: string;
  tasks: Task[];
  isCreator?: boolean;
}

const TaskCol = ({ status, tasks, boardId, isCreator }: ColumnProps) => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const filtered = tasks.filter((t) => t.status === status);

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

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Этот пользователь уже назначен");
        } else if (response.status === 404) {
          throw new Error("Задача не найдена");
        } else {
          throw new Error(data.message || "Неизвестная ошибка");
        }
      }

      showToast({
        message: `User ${data.user.name} assigned to ${data.task.title}`,
        type: "success",
      });
    } catch (error: any) {
      console.error("Error adding assignee:", error);
      showToast({ message: error.message, type: "error" });
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
          isCreator={isCreator}
        />
      ))}
    </div>
  );
};

export default TaskCol;
