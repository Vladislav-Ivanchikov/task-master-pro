import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@app/context/AuthContext.js";
import { useAppDispatch, useAppSelector } from "@shared/hooks/storeHooks.js";
import { TaskStatus } from "@appTypes/Task.js";
import {
  deleteTask,
  fetchTaskById,
  updateTaskStatus,
} from "@entities/task/api/taskThunks.js";
import { removeTaskAssignee } from "@features/task-assignees/api/taskAssigneesThunks.js";
import { errorInfo } from "@shared/lib/errorInfo.js";
import { TaskAssignees } from "@features/task-assignees/ui/TaskAssignees.js";
import { TaskNotes } from "@features/task-notes/ui/TaskNotes.js";
import { StatusBar } from "@widgets/status-bar/ui/StatusBar.js";
import { Button, Loader, useToast } from "@taskmaster/ui-kit";
import styles from "./TaskDetailsPage.module.css";

const TaskDetailsPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { token, user, isInitialized } = useAuth();
  const task = useAppSelector((state) => state.task.task);
  const isLoading = useAppSelector((state) => state.task.loading);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const isCreatorFromLocation = location.state?.isCreator || false;
  const isTaskCreator = user?.id === task?.creatorId || isCreatorFromLocation;

  useEffect(() => {
    if (!taskId || !isInitialized || !token || !user) return;
    dispatch(fetchTaskById(taskId));
  }, [taskId, isInitialized, token, user]);

  const handleRemoveAssignee = async (userId: string) => {
    try {
      const response = await dispatch(
        removeTaskAssignee({ taskId, userId, token })
      ).unwrap();

      if (!response) return;
      showToast({
        message: `Assignee removed successfully`,
        type: "success",
      });
      if (taskId) dispatch(fetchTaskById(taskId));
    } catch (err) {
      errorInfo(err, showToast);
    }
  };

  const handleUpdateStatus = async (newStatus: TaskStatus) => {
    if (!taskId) return;
    try {
      await dispatch(updateTaskStatus({ taskId, status: newStatus })).unwrap();
      showToast({
        message: `Status updated to ${newStatus.replace("_", " ")}`,
        type: "success",
      });
      dispatch(fetchTaskById(taskId));
    } catch (err) {
      errorInfo(err, showToast);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskId || !confirm("Are you sure you want to delete the task?"))
      return;
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      showToast({
        message: `Task "${task?.title ?? "?"}" deleted successfully`,
        type: "success",
      });
      navigate(-1);
    } catch (err) {
      errorInfo(err, showToast);
    }
  };

  if (!isInitialized || isLoading || !task) {
    return <Loader size="lg" />;
  }

  return (
    <div className={styles.container}>
      <section className={`${styles.section} ${styles.mainInfo}`}>
        <div className={styles.taskInfo}>
          <h3>{task.title}</h3>
          {task.description || "Описание задачи отсутствует"}
        </div>
        <StatusBar
          task={task}
          user={user}
          isTaskCreator={isTaskCreator}
          handleUpdateStatus={handleUpdateStatus}
          styles={styles}
        />
        {isTaskCreator && (
          <div className={styles.deleteBtn}>
            <Button onClick={handleDeleteTask} variant="danger" size="small">
              Удалить задачу
            </Button>
          </div>
        )}
        {Array.isArray(task.assignees) && (
          <TaskAssignees
            task={task}
            isTaskCreator={isTaskCreator}
            handleRemoveAssignee={handleRemoveAssignee}
            user={user}
          />
        )}
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
