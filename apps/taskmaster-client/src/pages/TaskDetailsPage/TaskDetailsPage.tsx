import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTaskById } from "../../store/features/slices/taskSlice";
import { TaskStatusActions } from "../../components/TaskStatusActions/TaskStatusActions";
import { TaskAssignees } from "../../components/TaskAssignees/TaskAssignees";
import { Button, Loader, useToast } from "@taskmaster/ui-kit";
import styles from "./TaskDetailsPage.module.css";
import { TaskNotes } from "../../components/TaskNotes/TaskNotes";

const TaskDetailsPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { token, user, isInitialized } = useAuth();
  const task = useAppSelector((state) => state.task.task);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const isCreatorFromLocation = location.state?.isCreator || false;
  const isTaskCreator = user?.id === task?.creatorId || isCreatorFromLocation;

  useEffect(() => {
    if (!taskId || !isInitialized || !token || !user) return;
    setIsLoading(true);
    dispatch(fetchTaskById(taskId)).finally(() => setIsLoading(false));
  }, [taskId, isInitialized, token, user]);

  const handleRemoveAssignee = async (userId: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/assignees/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to remove assignee");
      }
      showToast({
        message: `Assignee removed successfully`,
        type: "success",
      });
      if (taskId) dispatch(fetchTaskById(taskId));
    } catch (error: any) {
      showToast({
        message: error.message || "Failed to remove assignee",
        type: "error",
      });
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!taskId || !token) return;
    try {
      const response = await fetch(
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
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update status");
      }
      showToast({
        message: `Status updated to ${newStatus.replace("_", " ")}`,
        type: "success",
      });
      dispatch(fetchTaskById(taskId));
    } catch (error: any) {
      showToast({
        message: error.message || "Failed to update status",
        type: "error",
      });
    }
  };

  const handleDeleteTask = async () => {
    if (confirm("Are you sure you want to delete the task?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/tasks/task/${taskId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to delete task");
        }
        showToast({
          message: `Task "${task.title}" deleted successfully`,
          type: "success",
        });
        navigate(-1);
      } catch (error: any) {
        showToast({
          message: error.message || "Failed to delete task",
          type: "error",
        });
      }
    }
  };

  if (!isInitialized || isLoading) {
    return <Loader size="lg" />;
  }

  return (
    <div className={styles.container}>
      <section className={`${styles.section} ${styles.mainInfo}`}>
        <div className={styles.taskInfo}>
          <h3>{task.title}</h3>
          {task.description || "Описание задачи отсутствует"}
        </div>
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
          {task.assignees.some((a) => a.user.id === user?.id) && (
            <TaskStatusActions
              status={task.status}
              isCreator={isTaskCreator}
              updateStatus={handleUpdateStatus}
            />
          )}
        </div>
        {isTaskCreator && (
          <div className={styles.deleteBtn}>
            <Button onClick={handleDeleteTask} variant="danger" size="small">
              Удалить задачу
            </Button>
          </div>
        )}
        <TaskAssignees
          task={task}
          isTaskCreator={isTaskCreator}
          handleRemoveAssignee={handleRemoveAssignee}
          user={user}
        />
      </section>
      <TaskNotes
        taskId={taskId}
        currentUserId={user?.id}
        taskAssignees={task.assignees}
      />
    </div>
  );
};

export default TaskDetailsPage;
