import TaskCol from "../TaskCol/TaskCol.js";

type BoardTaskContentProps = {
  tasks: any[];
  boardId: string | undefined;
  isCreator: boolean;
  styles: CSSModuleClasses;
};

const BoardTaskContent = ({
  tasks,
  boardId,
  isCreator,
  styles,
}: BoardTaskContentProps) => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.columns}>
        {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
          <TaskCol
            key={status}
            status={status}
            tasks={tasks}
            boardId={boardId}
            isCreator={isCreator}
          />
        ))}
      </div>

      <div className={styles.reviewColumn}>
        <TaskCol
          status="PENDING_REVIEW"
          tasks={tasks}
          boardId={boardId}
          isCreator={isCreator}
        />
      </div>
    </div>
  );
};

export default BoardTaskContent;
