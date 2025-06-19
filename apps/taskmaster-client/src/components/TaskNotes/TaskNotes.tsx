import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, TextArea, useToast } from "@taskmaster/ui-kit";
import styles from "./TaskNotes.module.css";
import { Note } from "../../../../../packages/types/Note";
import { TaskAssignee } from "../../../../../packages/types/Task";

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

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      showToast({ message: "Failed to load notes", type: "error" });
    }
  };

  const createNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newNote }),
        }
      );
      const data = await res.json();
      setNewNote("");
      setNotes((prev) => [...prev, data]);
    } catch {
      showToast({ message: "Failed to create note", type: "error" });
    }
  };

  const updateNote = async (id: string, taskId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/notes/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editContent }),
        }
      );
      const updated = await res.json();
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, content: updated.content } : n))
      );
      setEditingId(null);
    } catch {
      showToast({ message: "Failed to update note", type: "error" });
    }
  };

  const deleteNote = async (id: string, taskId: string) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/notes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      showToast({ message: "Failed to delete note", type: "error" });
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [taskId]);

  if (!taskId) return <>TaskId is required</>;

  return (
    <div className={styles.notesContainer}>
      <h3>Notes</h3>
      <div className={styles.notesList}>
        {notes.map((note) => (
          <div key={note.id} className={styles.note}>
            <div className={styles.noteHeader}>
              <span className={styles.noteAuthor}>{note.author.name}</span>
              <span>{new Date(note.createdAt).toLocaleString()}</span>
            </div>
            {editingId === note.id ? (
              <>
                <TextArea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent((e.target as HTMLTextAreaElement).value)
                  }
                />
                <Button
                  size="small"
                  onClick={() => updateNote(note.id, taskId)}
                >
                  Save
                </Button>
              </>
            ) : (
              <p>{note.content}</p>
            )}
            {note.author.id === currentUserId && (
              <div className={styles.noteActions}>
                <Button
                  size="small"
                  onClick={() => {
                    setEditContent(note.content);
                    setEditingId(note.id);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  variant="danger"
                  onClick={() => deleteNote(note.id, taskId)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {taskAssignees?.some((a) => a.user.id === currentUserId) && (
        <div className={styles.newNote}>
          <TextArea
            value={newNote}
            onChange={(e) =>
              setNewNote((e.target as HTMLTextAreaElement).value)
            }
            placeholder="Write a note..."
          />
          <Button onClick={createNote}>Send</Button>
        </div>
      )}
    </div>
  );
};
