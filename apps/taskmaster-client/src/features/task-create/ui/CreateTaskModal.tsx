import { useState } from "react";
import { fetchTasks, createTask } from "@entities/task/api/taskThunks.js";
import { useAppDispatch } from "@shared/hooks/storeHooks.js";
import { TaskStatus } from "@appTypes/Task.js";
import StatusSelector from "@shared/ui/StatusSelector.js";
import {
  Button,
  FormGroup,
  Input,
  Modal,
  TextArea,
  useToast,
} from "@taskmaster/ui-kit";

export type CreateTaskModalProps = {
  onClose: () => void;
  onSuccess: () => Promise<void>;
  id: string;
};

const CreateTaskModal = ({ onClose, id }: CreateTaskModalProps) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = taskTitle.trim();
    const trimmedDescription = taskDescription.trim();

    setTitleError(!trimmedTitle);
    setDescriptionError(!trimmedDescription);

    if (!trimmedTitle || !trimmedDescription) return;

    try {
      setIsLoading(true);
      const result = await dispatch(
        createTask({
          boardId: id,
          title: trimmedTitle,
          description: trimmedDescription,
          status: taskStatus,
        })
      ).unwrap();

      await dispatch(fetchTasks(id)).unwrap();

      showToast({
        message: `Task "${result.title}" created successfully!`,
        type: "success",
      });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      showToast({ message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Create new Task" isOpen={true} onClose={onClose}>
      <FormGroup onSubmit={handleSubmit}>
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
        <StatusSelector value={taskStatus} onChange={setTaskStatus} />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add New Task"}
        </Button>
      </FormGroup>
    </Modal>
  );
};

export default CreateTaskModal;
