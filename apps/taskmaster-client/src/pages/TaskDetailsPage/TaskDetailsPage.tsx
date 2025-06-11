import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./TaskDetailsPage.module.css";
import { TaskAssignee } from "../../../../../packages/types/Task";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTaskById } from "../../store/features/slices/taskSlice";
import { Button } from "@taskmaster/ui-kit";

const TaskDetails = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { token, user, isInitialized } = useAuth();
  const [isCreator, setIsCreator] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.task.task);

  useEffect(() => {
    if (!token || !isInitialized || !user || !taskId) return;
    dispatch(fetchTaskById(taskId)).finally(() => setLoading(false));
  }, [token, isInitialized, user, taskId]);

  useEffect(() => {
    if (task && user) setIsCreator(task.creatorId === user.id);
  }, [task, user]);

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  console.log(task);

  return (
    <div className={styles.container}>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <div className={styles.statusBlock}>
        <strong>Status:</strong> {task.status}
        {/* TODO: статус кнопка */}
      </div>

      <div className={styles.assignees}>
        <h3>Assignees</h3>
        <ul>
          {task.assignees.map((assignee: TaskAssignee) => (
            <li key={assignee.user.id}>
              {assignee.user.name} {assignee.user.surname} (
              {assignee.user.email})
              {isCreator && assignee.user.id !== user?.id && (
                <button
                  onClick={() => console.log(assignee.user.id)}
                  className={styles.removeBtn}
                >
                  ❌
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* TODO: Компонент заметок исполнителей */}
      {isCreator && (
        <Button
          onClick={() => {
            if (confirm("Are you sure you want to delete the task?")) {
              fetch(
                `${import.meta.env.VITE_API_URL}/api/tasks/task/${taskId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              ).then((res) => {
                if (res.ok) {
                  alert("Task deleted successfully");
                  navigate(`/boards/${task.boardId}`);
                } else {
                  alert("Failed to delete task");
                }
              });
            }
          }}
          className={styles.deleteBtn}
        >
          Delete task
        </Button>
      )}
    </div>
  );
};

export default TaskDetails;
