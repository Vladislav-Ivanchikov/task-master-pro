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
        <p>Wait for the participants will start this task.</p>
      ) : (
        <Button variant="secondary" onClick={() => updateStatus("IN_PROGRESS")}>
          Start working
        </Button>
      );

    case "IN_PROGRESS":
      return isCreator ? (
        <p>Task in progress</p>
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
        <div style={{ display: "flex", gap: "8px" }}>
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
        <p>Waiting for review...</p>
      );

    case "DONE":
      return <p>Task completed</p>;

    default:
      return null;
  }
};
