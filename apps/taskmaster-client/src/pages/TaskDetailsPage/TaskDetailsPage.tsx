import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTaskById } from "../../store/features/slices/taskSlice";
import { TaskStatusActions } from "../../components/TaskStatusActions/TaskStatusActions";
import { TaskAssignee } from "../../../../../packages/types/Task";
import { Button, useToast } from "@taskmaster/ui-kit";
import styles from "./TaskDetailsPage.module.css";

const TaskDetails = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { token, user, isInitialized } = useAuth();
  const task = useAppSelector((state) => state.task.task);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const isCreatorFromLocation = location.state?.isCreator || false;
  const isCreator = user?.id === task?.creatorId || isCreatorFromLocation;

  useEffect(() => {
    if (!taskId || !isInitialized || !token || !user) return;
    setLoading(true);
    dispatch(fetchTaskById(taskId)).finally(() => setLoading(false));
  }, [taskId, isInitialized, token, user]);

  const removeAssignee = async (userId: string) => {
    try {
      const res = await fetch(
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
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to remove assignee");
      }
      showToast({
        message: `Assignee ${task.assignees.find((a) => a.user.id === userId)?.user.name} removed successfully`,
        type: "success",
      });
    } catch (error: any) {
      showToast({
        message: error.message || "Failed to remove assignee",
        type: "error",
      });
      console.error(error);
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

      showToast({
        message: `Status updated to ${newStatus.replace("_", " ")}`,
        type: "success",
      });

      dispatch(fetchTaskById(taskId));
    } catch (err: any) {
      console.error("Ошибка смены статуса:", err);
      showToast({ message: err.message, type: "error" });
    }
  };

  const deleteTask = async () => {
    if (confirm("Are you sure you want to delete the task?")) {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tasks/task/${taskId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to delete task");
        }

        showToast({
          message: `Task "${task.title}" deleted successfully`,
          type: "success",
        });
        navigate(-1);
      } catch (error: any) {
        console.error("Error deleting task:", error);
        showToast({
          message: error.message || "Failed to delete task",
          type: "error",
        });
      }
    }
  };

  if (!isInitialized || loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>{task.title}</h1>
      <p>{task.description}</p>
      <div className={styles.statusBlock}>
        <div>
          <strong>Status:</strong> {task.status.replace("_", " ").toUpperCase()}
        </div>
        <TaskStatusActions
          status={task.status}
          isCreator={isCreator}
          updateStatus={updateStatus}
        />
      </div>

      <div className={styles.assignees}>
        <h3>Assignees</h3>
        <ul>
          {[...task.assignees]
            .sort((a, b) => {
              // Перемещаем создателя задачи вверх
              if (a.user.id === task.creatorId) return -1;
              if (b.user.id === task.creatorId) return 1;
              return 0;
            })
            .map((assignee: TaskAssignee) => (
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
              deleteTask();
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
