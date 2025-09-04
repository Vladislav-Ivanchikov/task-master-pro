import { TaskStatusActions } from "@features/task-status/ui/TaskStatusActions.js";
import { Task, TaskStatus } from "@appTypes/Task.js";
import { User } from "@appTypes/User.js";

type StatusBarProps = {
  task: Task;
  user: User | null;
  isTaskCreator: boolean;
  handleUpdateStatus: (newStatus: TaskStatus) => Promise<void>;
  styles: CSSModuleClasses;
};

export const StatusBar = ({
  task,
  user,
  isTaskCreator,
  handleUpdateStatus,
  styles,
}: StatusBarProps) => {
  return (
    <div className={styles.statusBar}>
      <span className={styles.statusLabel}>Статус:</span>
      <p className={styles.statusValue}>
        <svg width="18" height="18" stroke="currentColor" fill="none">
          <circle cx="8" cy="8" r="7" strokeWidth="1" />
          <circle cx="8" cy="8" r="2" fill="#FFA94D" />
        </svg>
        {task.status === "PENDING_REVIEW"
          ? "REVIEW"
          : task.status.replace("_", " ")}
      </p>
      {Array.isArray(task.assignees) &&
        task.assignees.some((a) => a.user.id === user?.id) && (
          <TaskStatusActions
            status={task.status}
            isCreator={isTaskCreator}
            updateStatus={handleUpdateStatus}
          />
        )}
    </div>
  );
};
