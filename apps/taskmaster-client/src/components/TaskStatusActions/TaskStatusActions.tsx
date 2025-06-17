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
      return (
        <Button variant="secondary" onClick={() => updateStatus("IN_PROGRESS")}>
          Start working
        </Button>
      );

    case "IN_PROGRESS":
      return (
        <Button
          variant="primary"
          onClick={() => updateStatus("PENDING_REVIEW")}
        >
          Send to Review
        </Button>
      );

    case "PENDING_REVIEW":
      return isCreator ? (
        <>
          <Button
            variant="secondary"
            onClick={() => updateStatus("IN_PROGRESS")}
          >
            Reject
          </Button>
          <Button variant="primary" onClick={() => updateStatus("DONE")}>
            Approve
          </Button>
        </>
      ) : (
        <p>Waiting for review...</p>
      );

    case "DONE":
      return <p>Task completed</p>;

    default:
      return null;
  }
};
