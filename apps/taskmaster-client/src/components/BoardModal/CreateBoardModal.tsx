import { FormGroup, Input, Modal, TextArea, Button } from "@taskmaster/ui-kit";
import { useState } from "react";
import styles from "./CreateBoardModal.module.css";

type CreateBoardModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

const CreateBoardModal = ({ onClose, onSuccess }: CreateBoardModalProps) => {
  const [boardTitle, setBoardTitle] = useState("");
  const [boardDescription, setBoardDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim()) {
      alert("Please enter a board title.");
      return;
    }

    if (!boardDescription.trim()) {
      alert("Please enter a board description.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/boards/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: boardTitle,
            description: boardDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create board");
      }

      const data = await response.json();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  return (
    <Modal title="Create new Board" isOpen={true} onClose={onClose}>
      <div>
        <p className={styles.infoText}>
          Create a new board to start organizing your tasks. A board can
          represent a project, a team, or any other collection of tasks.
        </p>
      </div>
      <FormGroup>
        <Input
          label="Board title"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          placeholder="Enter board title"
        ></Input>
        <TextArea
          label="Board Description"
          rows={6}
          value={boardDescription}
          onChange={(e) => setBoardDescription(e.target.value)}
          placeholder="Describe your board"
        ></TextArea>
        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          Add New Board
        </Button>
      </FormGroup>
    </Modal>
  );
};

export default CreateBoardModal;
