import { useNavigate } from "react-router-dom";
import styles from "../../pages/BoardPage/BoardPage.module.css";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface ColumnProps {
  boardId: string | undefined;
  status: string;
  tasks: Task[];
}

const TaskCol: React.FC<ColumnProps> = ({ status, tasks, boardId }) => {
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

  return (
    <div className={styles.column}>
      <h3 className={styles.columnTitle}>{getLabel(status)}</h3>
      {filtered.map((task) => (
        <div
          key={task.id}
          className={styles.taskCard}
          onClick={() => {
            navigate(`/boards/${boardId}/tasks/${task.id}`);
          }}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskCol;
