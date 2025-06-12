import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { TaskAssignee } from "../../../../../packages/types/Task";
import { fetchTaskById } from "../../store/features/slices/taskSlice";
import { Button } from "@taskmaster/ui-kit";
import styles from "./TaskDetailsPage.module.css";

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

  const removeAssignee = async (userId: string) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/assignees/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (taskId) dispatch(fetchTaskById(taskId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  console.log(task);

  const statusButtons = (status: string) => {
    switch (status) {
      case "TODO":
        return [
          <Button
            key="start"
            variant="secondary"
            onClick={() => updateStatus("IN_PROGRESS")}
          >
            Start working
          </Button>,
        ];
      case "IN_PROGRESS":
        return [
          <Button
            key="review"
            variant="primary"
            onClick={() => updateStatus("PENDING_REVIEW")}
          >
            Send to Review
          </Button>,
        ];
      case "PENDING_REVIEW":
        if (isCreator) {
          return [
            <Button
              key="reject"
              variant="secondary"
              onClick={() => updateStatus("IN_PROGRESS")}
            >
              Reject
            </Button>,
            <Button
              key="approve"
              variant="primary"
              onClick={() => updateStatus("DONE")}
            >
              Approve
            </Button>,
          ];
        }
        return [<p key="wait">Waiting for review...</p>];
      case "DONE":
        return [<p key="done">Task completed</p>];
      default:
        return null;
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!taskId || !token) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update status");
      }

      dispatch(fetchTaskById(taskId));
    } catch (err: any) {
      console.error("Ошибка смены статуса:", err);
      alert(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <div className={styles.statusBlock}>
        <div>
          <strong>Status:</strong> {task.status.replace("_", " ")}
        </div>
        <div className={styles.statusBtn}>{statusButtons(task.status)}</div>
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
                  onClick={() => removeAssignee(assignee.user.id)}
                  className={styles.removeBtn}
                >
                  &times;
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* TODO: Компонент заметок исполнителей */}
      {isCreator && (
        <div className={styles.deleteBtn}>
          <Button
            variant="danger"
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
          >
            Delete task
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;
