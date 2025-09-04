import {
  FormGroup,
  Input,
  Modal,
  TextArea,
  Button,
  useToast,
} from "@taskmaster/ui-kit";
import { useState } from "react";
import { useAppDispatch } from "@shared/hooks/storeHooks.js";
import { createBoard } from "@entities/board/api/boardsThunks.js";
import styles from "./CreateBoardModal.module.css";

type CreateBoardModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

type BoardFormErrors = {
  title?: string;
  description?: string;
};

const CreateBoardModal = ({ onClose, onSuccess }: CreateBoardModalProps) => {
  const [boardTitle, setBoardTitle] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<BoardFormErrors>({});

  const { showToast } = useToast();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!boardTitle.trim()) {
      setError({ title: "Please enter a board title.", description: "" });
      return;
    }
    if (!boardDescription.trim()) {
      setError({ title: "", description: "Please enter a board description." });
      return;
    }

    try {
      setIsLoading(true);
      setError({});

      const response = await dispatch(
        createBoard({ title: boardTitle, description: boardDescription })
      );

      if (createBoard.fulfilled.match(response)) {
        showToast({
          message: `Board "${response.payload.title}" created successfully!`,
          type: "success",
        });
        onSuccess();
        onClose();
      } else {
        showToast({
          message: "Failed to create board",
          type: "error",
        });
      }
    } catch (error: any) {
      console.error("Error creating board:", error);
      showToast({
        message: error.message || "Failed to create board",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Create new Board" isOpen={true} onClose={onClose}>
      <div>
        <p
          style={{
            marginBottom: "1rem",
            fontSize: "0.9rem",
            color: "var(--color-text-secondary)",
          }}
        >
          Create a new board to start organizing your tasks. A board can
          represent a project, a team, or any other collection of tasks.
        </p>
      </div>
      <FormGroup onSubmit={handleSubmit}>
        <Input
          label="Board title"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          placeholder="Enter board title"
          error={error?.title}
          required
        ></Input>
        <TextArea
          label="Board Description"
          rows={6}
          value={boardDescription}
          onChange={(e) =>
            setBoardDescription((e.target as HTMLTextAreaElement).value)
          }
          placeholder="Describe your board"
          error={error?.description}
          required
        ></TextArea>
        <Button type="submit" disabled={isLoading}>
          Add New Board
        </Button>
      </FormGroup>
    </Modal>
  );
};

export default CreateBoardModal;
