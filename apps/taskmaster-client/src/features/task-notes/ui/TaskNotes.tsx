import { useEffect, useRef, useState } from "react";
import { useAuth } from "@app/context/AuthContext.js";
import { Loader, useToast } from "@taskmaster/ui-kit";
import { TaskAssignee } from "@appTypes/Task.js";
import { useAppDispatch, useAppSelector } from "@shared/hooks/storeHooks.js";
import {
  createTaskNote,
  deleteTaskNote,
  fetchTaskNotes,
  updateTaskNote,
} from "../api/taskNotesThunks.js";
import { deleteFile, getPresignedUrl, uploadFile } from "../api/fileThunks.js";
import { NewNote } from "./NewNote.js";
import { NotesBlock } from "./NotesBlock.js";
import styles from "@pages/TaskDetailsPage/TaskDetailsPage.module.css";

interface TaskNotesProps {
  taskId: string | undefined;
  currentUserId: string | undefined;
  taskAssignees?: TaskAssignee[];
}

export const TaskNotes = ({
  taskId,
  currentUserId,
  taskAssignees,
}: TaskNotesProps) => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const dispatch = useAppDispatch();
  const { notes, loading } = useAppSelector((state) => state.taskNotes);

  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedFileData, setAttachedFileData] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createNote = async () => {
    if (!newNote.trim()) {
      showToast({ message: "Note cannot be empty", type: "error" });
      return;
    }

    let fileId: string | undefined = undefined;

    if (attachedFile) {
      try {
        const fileData = await dispatch(
          uploadFile({ taskId, file: attachedFile, token })
        ).unwrap();
        fileId = fileData.id;
        showToast({ message: "File uploaded", type: "success" });
        setAttachedFile(null);
        setAttachedFileData(null);
      } catch {
        showToast({ message: "Failed to upload file", type: "error" });
        return;
      }
    }

    try {
      await dispatch(
        createTaskNote({ taskId, content: newNote, token, fileId })
      ).unwrap();
      setNewNote("");
      setAttachedFile(null);
      showToast({ message: "Note created", type: "success" });
    } catch {
      showToast({ message: "Failed to create note", type: "error" });
    }
  };

  const updateNote = async (id: string) => {
    try {
      await dispatch(
        updateTaskNote({ id, taskId, editContent, token })
      ).unwrap();
      showToast({ message: "Note updated", type: "success" });
      setEditingId(null);
    } catch {
      showToast({ message: "Failed to update note", type: "error" });
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await dispatch(deleteTaskNote({ id, taskId, token })).unwrap();
      showToast({ message: "Note deleted", type: "success" });
    } catch {
      showToast({ message: "Failed to delete note", type: "error" });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast({ message: "File size must be less than 10MB", type: "error" });
      return;
    }

    setAttachedFile(file);
    setAttachedFileData(null);
    showToast({
      message: `File ${file.name} chosen`,
      type: "success",
    });
  };

  const deleteAttachedFile = async () => {
    if (!attachedFileData?.id) return;
    try {
      await dispatch(
        deleteFile({ fileId: attachedFileData.id, token })
      ).unwrap();
      setAttachedFile(null);
      setAttachedFileData(null);
      showToast({ message: "File deleted", type: "success" });
    } catch {
      showToast({ message: "Failed to delete file", type: "error" });
    }
  };

  const fetchPresignedUrl = async (fileId: string) => {
    try {
      return await dispatch(getPresignedUrl({ fileId, token })).unwrap();
    } catch {
      showToast({ message: "Failed to fetch presigned url", type: "error" });
      return null;
    }
  };

  useEffect(() => {
    if (taskId && token) {
      dispatch(fetchTaskNotes({ taskId, token }));
    }
  }, [taskId]);

  if (!taskId) return <>TaskId is required</>;
  if (loading) return <Loader />;

  return (
    <section className={`${styles.section} ${styles.chatNotes}`}>
      <h3>Note and files</h3>
      {notes && notes.length > 0 ? (
        <NotesBlock
          styles={styles}
          notes={notes}
          editContent={editContent}
          currentUserId={currentUserId}
          editingId={editingId}
          setEditingId={setEditingId}
          setEditContent={setEditContent}
          updateNote={updateNote}
          deleteNote={deleteNote}
          fetchPresignedUrl={fetchPresignedUrl}
        />
      ) : (
        <div className={styles.noNotes}>Заметок пока нет</div>
      )}
      {taskAssignees?.some((a) => a.user.id === currentUserId) && (
        <NewNote
          newNote={newNote}
          attachedFile={attachedFile}
          fileInputRef={fileInputRef}
          setNewNote={setNewNote}
          handleFileSelect={handleFileSelect}
          deleteAttachedFile={deleteAttachedFile}
          createNote={createNote}
          styles={styles}
        />
      )}
    </section>
  );
};
