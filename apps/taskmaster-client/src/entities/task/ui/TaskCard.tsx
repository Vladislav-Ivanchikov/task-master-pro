import { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { useNavigate } from "react-router-dom";
import { Task } from "@appTypes/Task.js";
import { useToast } from "@taskmaster/ui-kit";
import styles from "@pages/BoardPage/BoardPage.module.css";

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
  const isCreatorRef = useRef(isCreator);

  useEffect(() => {
    isCreatorRef.current = isCreator;
  }, [isCreator]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "BOARD_MEMBER",
    drop: async (item: { userId: string; dragId: string }) => {
      if (!isCreatorRef.current) {
        showToast({
          message: "You are not allowed to assign members to this task.",
          type: "error",
        });
        return;
      }

      try {
        await onAssignMember(task.id, item.userId);
      } catch (error: any) {
        showToast({ message: error.message, type: "error" });
      }
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
