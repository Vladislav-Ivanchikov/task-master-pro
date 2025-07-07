import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, TextArea, useToast } from "@taskmaster/ui-kit";
import { Note } from "../../../../../packages/types/Note";
import { TaskAssignee } from "../../../../../packages/types/Task";
import styles from "../../pages/TaskDetailsPage/TaskDetailsPage.module.css";

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
    <section className={`${styles.section} ${styles.chatNotes}`}>
      <h3>Чат и заметки</h3>
      {notes && notes.length > 0 ? (
        <div className={styles.notesBlock}>
          {notes.map((n) => (
            <div key={n.id} className={styles.note}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{ color: "var(--color-orange-dark)", fontWeight: 500 }}
                >
                  {n.author.name}
                </span>
                <span style={{ color: "#a1a1aa" }}>
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              {editingId === n.id ? (
                <TextArea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent((e.target as HTMLTextAreaElement).value)
                  }
                />
              ) : (
                <p style={{ margin: "0 0 0.5em 0" }}>{n.content}</p>
              )}
              {n.author.id === currentUserId && (
                <div className={styles.noteActions}>
                  {editingId === n.id ? (
                    <Button
                      onClick={() => {
                        updateNote(n.id, taskId);
                        setEditContent("");
                      }}
                      size="small"
                    >
                      Сохранить
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setEditingId(n.id);
                        setEditContent(n.content);
                      }}
                      size="small"
                    >
                      Изменить
                    </Button>
                  )}
                  <Button onClick={() => deleteNote(n.id, taskId)} size="small">
                    Удалить
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noNotes}>Заметок пока нет</div>
      )}
      {taskAssignees?.some((a) => a.user.id === currentUserId) && (
        <div>
          <TextArea
            value={newNote}
            onChange={(e) =>
              setNewNote((e.target as HTMLTextAreaElement).value)
            }
            placeholder="Написать заметку..."
          />
          <div style={{ textAlign: "right" }}>
            <Button onClick={createNote}>Отправить</Button>
          </div>
        </div>
      )}
    </section>
  );
};
