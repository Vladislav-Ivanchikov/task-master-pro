import React from "react";
import { Button } from "@taskmaster/ui-kit";
import { TaskStatus } from "../../../../../packages/types/Task";

interface TaskStatusActionsProps {
  status: TaskStatus;
  isCreator: boolean;
  updateStatus: (status: string) => void;
}

export const TaskStatusActions: React.FC<TaskStatusActionsProps> = ({
  status,
  isCreator,
  updateStatus,
}) => {
  switch (status) {
    case "TODO":
      return isCreator ? (
        <span>Wait for the participants will start this task.</span>
      ) : (
        <Button variant="secondary" onClick={() => updateStatus("IN_PROGRESS")}>
          Start working
        </Button>
      );

    case "IN_PROGRESS":
      return isCreator ? (
        <span>Task in progress</span>
      ) : (
        <Button
          variant="primary"
          onClick={() => updateStatus("PENDING_REVIEW")}
        >
          Send to Review
        </Button>
      );

    case "PENDING_REVIEW":
      return isCreator ? (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="secondary"
            onClick={() => updateStatus("IN_PROGRESS")}
          >
            Reject
          </Button>
          <Button variant="primary" onClick={() => updateStatus("DONE")}>
            Approve
          </Button>
        </div>
      ) : (
        <span>Waiting for review...</span>
      );

    case "DONE":
      return <span>Task completed</span>;

    default:
      return null;
  }
};
