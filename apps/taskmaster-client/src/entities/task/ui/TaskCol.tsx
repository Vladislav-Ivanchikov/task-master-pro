import { useAuth } from "@app/context/AuthContext.js";
import { getLabel } from "@shared/lib/getLabel.js";
import { Task } from "@appTypes/Task.js";
import TaskCard from "./TaskCard.js";
import { useToast } from "@taskmaster/ui-kit";
import { useAppDispatch } from "@shared/hooks/storeHooks.js";
import { addTaskAssignee } from "@features/task-assignees/api/taskAssigneesThunks.js";
import { errorInfo } from "@shared/lib/errorInfo.js";
import styles from "@pages/BoardPage/BoardPage.module.css";

interface ColumnProps {
  boardId: string | undefined;
  status: string;
  tasks: Task[];
  isCreator?: boolean;
}

const TaskCol = ({ status, tasks, boardId, isCreator }: ColumnProps) => {
  const { token } = useAuth();
  const filtered = tasks.filter((t) => t.status === status);
  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const addAssignee = async (taskId: string, userId: string) => {
    try {
      const data = await dispatch(
        addTaskAssignee({ taskId, userId, token })
      ).unwrap();

      showToast({
        message: `User ${data.user.name} assigned to ${data.task.title}`,
        type: "success",
      });
    } catch (error: any) {
      console.error("Error adding assignee:", error);
      errorInfo(error, showToast);
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
          isCreator={!!isCreator}
        />
      ))}
    </div>
  );
};

export default TaskCol;
