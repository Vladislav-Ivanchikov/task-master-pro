import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchTaskById } from "../../store/features/slices/taskSlice";
import { TaskStatusActions } from "../../components/TaskStatusActions/TaskStatusActions";
import { TaskAssignees } from "../../components/TaskAssignees/TaskAssignees";
import { Button, useToast } from "@taskmaster/ui-kit";
import styles from "./TaskDetailsPage.module.css";

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
          isCreator={isTaskCreator}
          updateStatus={handleUpdateStatus}
        />
      </div>

      <TaskAssignees
        task={task}
        isTaskCreator={isTaskCreator}
        handleRemoveAssignee={handleRemoveAssignee}
        user={user}
      />

      {/* TODO: Компонент заметок исполнителей */}
      {isTaskCreator && (
        <div className={styles.deleteBtn}>
          <Button variant="danger" onClick={handleDeleteTask}>
            Delete task
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailsPage;
