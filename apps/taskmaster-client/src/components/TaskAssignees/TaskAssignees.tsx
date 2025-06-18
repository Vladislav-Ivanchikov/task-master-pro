import { Task } from "../../../../../packages/types/Task";
import { User } from "../../../../../packages/types/User";
import styles from "../../pages/TaskDetailsPage/TaskDetailsPage.module.css";

type TaskAssigneesProps = {
  task: Task;
  isTaskCreator: boolean;
  handleRemoveAssignee: (userId: string) => void;
  user: User | null | undefined;
};

export const TaskAssignees = ({
  task,
  isTaskCreator,
  handleRemoveAssignee,
  user,
}: TaskAssigneesProps) => {
  return (
    <div className={styles.assignees}>
      <h3>Assignees</h3>
      <ul>
        {[...task.assignees]
          .sort((a, b) => {
            if (a.user.id === task.creatorId) return -1;
            if (b.user.id === task.creatorId) return 1;
            return 0;
          })
          .map((assignee) => (
            <li key={assignee.user.id}>
              {assignee.user.name} {assignee.user.surname} (
              {assignee.user.email})
              {isTaskCreator && assignee.user.id !== user?.id && (
                <button
                  onClick={() => handleRemoveAssignee(assignee.user.id)}
                  className={styles.removeBtn}
                >
                  &times;
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
