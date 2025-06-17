import { useDrop } from "react-dnd";
import { Task } from "../../../../../packages/types/Task";
import styles from "../../pages/BoardPage/BoardPage.module.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@taskmaster/ui-kit";

interface TaskCardProps {
  task: Task;
  onAssignMember: (userId: string, taskId: string) => void;
  boardId: string | undefined;
  isCreator?: boolean;
}

const TaskCard = ({
  task,
  onAssignMember,
  boardId,
  isCreator,
}: TaskCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { showToast } = useToast();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "BOARD_MEMBER",
    canDrop: () => !!isCreator,
    drop: async (item: { userId: string }) => {
      if (!isCreator) {
        showToast({
          message: "You are not allowed to assign members to this task.",
          type: "error",
        });
        return;
      }
      await onAssignMember(task.id, item.userId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (ref.current) drop(ref.current);
  }, [ref, drop]);

  return (
    <div
      ref={ref}
      className={styles.taskCard}
      style={{ opacity: isOver ? 0.5 : 1 }}
      onClick={() =>
        navigate(`/boards/${boardId}/tasks/${task.id}`, {
          state: { isCreator },
        })
      }
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard;
