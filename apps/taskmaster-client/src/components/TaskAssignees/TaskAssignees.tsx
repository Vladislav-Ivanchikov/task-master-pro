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
    <div className={styles.assigneesBlock}>
      <div style={{ fontWeight: 500, color: "#a1a1aa", marginBottom: 8 }}>
        Исполнители
      </div>
      <ul className={styles.assigneesList}>
        {[...task.assignees]
          .sort((a, b) => {
            if (a.user.id === task.creatorId) return -1;
            if (b.user.id === task.creatorId) return 1;
            return 0;
          })
          .map((a) => (
            <li
              key={a.id}
              className={
                a.user.id === task.creatorId
                  ? styles.creator
                  : styles.assigneeItem
              }
            >
              <div className={styles.assigneeInfo}>
                {/* <img
                className={styles.avatar}
                src={a.avatar}
                alt={a.name}
              /> */}
                <span>
                  {a.user.name}{" "}
                  {a.user.id === task.creatorId && `(${a.user.role})`}
                </span>
              </div>

              {isTaskCreator && user?.id !== a.user.id && (
                <button
                  onClick={() => handleRemoveAssignee(a.user.id)}
                  className={styles.removeBtn}
                  aria-label="Удалить исполнителя"
                >
                  <svg
                    width="20"
                    height="20"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
                    <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
                  </svg>
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
