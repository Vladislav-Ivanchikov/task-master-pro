import { Board } from "../../../../../packages/types/Board";
import styles from "../../pages/DashboardPage/DashboardPage.module.css";
import { useNavigate } from "react-router-dom";

type BoardListProps = {
  boards: Board[];
  deleteBoard: (id: string) => Promise<void>;
};

export const BoardList = ({ boards, deleteBoard }: BoardListProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.boardList}>
      {boards.map((board) => {
        return (
          <div
            key={board.id}
            className={styles.boardCard}
            onClick={() => navigate("/boards/" + board.id)}
          >
            <h3>{board.title}</h3>
            <p>{board.description}</p>
            <div className={styles.boardTasks}>
              <p>
                {board.tasks.length} {board.tasks.length > 1 ? "Tasks" : "Task"}
              </p>
              {board.tasks.filter((task) => task.status === "PENDING_REVIEW")
                .length > 0 ? (
                <p className={styles.pendingReview}></p>
              ) : null}
            </div>
            <span
              onClick={(e) => {
                e.stopPropagation();
                deleteBoard(board.id);
              }}
            >
              &times;
            </span>
          </div>
        );
      })}
    </div>
  );
};
