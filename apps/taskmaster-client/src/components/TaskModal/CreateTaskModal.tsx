import { useState } from "react";
import { fetchTasks } from "../../store/features/slices/taskSlice";
import { useAppDispatch } from "../../store/hooks";
import {
  Button,
  FormGroup,
  Input,
  Modal,
  Radio,
  TextArea,
  useToast,
} from "@taskmaster/ui-kit";

export type CreateTaskModalProps = {
  onClose: () => void;
  onSuccess: () => Promise<void>;
  id: string | undefined;
};

const CreateTaskModal = ({ onClose, id }: CreateTaskModalProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState("TODO");
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      setTitleError(true);
      return;
    } else {
      setTitleError(false);
    }

    if (!taskDescription.trim()) {
      setDescriptionError(true);
      return;
    } else {
      setDescriptionError(false);
    }

    if (!id) {
      console.error("Board ID is required to create a task.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            boardId: id,
            title: taskTitle,
            description: taskDescription,
            status: taskStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      dispatch(fetchTasks(id as string));
      onClose();
      showToast({
        message: `Task "${data.title}" created successfully!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Create new Task" isOpen={true} onClose={onClose}>
      <div></div>
      <FormGroup>
        <Input
          label="Task title"
          required
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          placeholder="Enter task title"
          error={titleError ? "Title is required" : ""}
        ></Input>
        <TextArea
          label="Task description"
          required
          rows={6}
          value={taskDescription}
          onChange={(e) =>
            setTaskDescription((e.target as HTMLTextAreaElement).value)
          }
          placeholder="Describe your task"
          error={descriptionError ? "Description is required" : ""}
        ></TextArea>
        <div className="ratio">
          <p>Choose status</p>
          <Radio
            name="status"
            value="TODO"
            label="ToDo"
            checked={taskStatus === "TODO"}
            onChange={() => setTaskStatus("TODO")}
          />
          <Radio
            name="status"
            value="IN_PROGRESS"
            label="In Progress"
            checked={taskStatus === "IN_PROGRESS"}
            onChange={() => setTaskStatus("IN_PROGRESS")}
          />
          <Radio
            name="status"
            value="DONE"
            label="Done"
            checked={taskStatus === "DONE"}
            onChange={() => setTaskStatus("DONE")}
          />
        </div>
        <Button type="submit" onClick={handleSubmit}>
          Add New Task
        </Button>
      </FormGroup>
    </Modal>
  );
};

export default CreateTaskModal;
