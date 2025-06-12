import { useDrop } from "react-dnd";
import { Task } from "../../../../../packages/types/Task";
import styles from "../../pages/BoardPage/BoardPage.module.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface TaskCardProps {
  task: Task;
  onAssignMember: (userId: string, taskId: string) => void;
  boardId: string | undefined;
}

const TaskCard = ({ task, onAssignMember, boardId }: TaskCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "BOARD_MEMBER",
    drop: async (item: { userId: string }) => {
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
      onClick={() => navigate(`/boards/${boardId}/tasks/${task.id}`)}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskCard;
