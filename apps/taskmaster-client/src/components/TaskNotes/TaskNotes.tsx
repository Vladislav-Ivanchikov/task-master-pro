import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { Button, Loader, TextArea, useToast } from "@taskmaster/ui-kit";
import { Note } from "../../../../../packages/types/Note.js";
import { TaskAssignee } from "../../../../../packages/types/Task.js";
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
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [attachedFileData, setAttachedFileData] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!newNote.trim()) {
      showToast({ message: "Note cannot be empty", type: "error" });
      return;
    }

    let fileId: string | undefined = undefined;

    if (attachedFile) {
      const formData = new FormData();
      formData.append("file", attachedFile);

      try {
        const fileRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/files/${taskId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!fileRes.ok) throw new Error("Upload failed");

        const fileData = await fileRes.json();
        fileId = fileData.id;
      } catch {
        showToast({ message: "Ошибка загрузки файла", type: "error" });
        return;
      }
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: newNote,
            ...(fileId ? { fileId } : {}),
          }),
        }
      );
      const data = await res.json();
      setNotes((prev) => [...prev, data]);
      setNewNote("");
      setAttachedFile(null);
      showToast({ message: "Заметка создана", type: "success" });
    } catch {
      showToast({ message: "Ошибка создания заметки", type: "error" });
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
      showToast({ message: "Note deleted", type: "success" });
    } catch {
      showToast({ message: "Failed to delete note", type: "error" });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast({ message: "Файл больше 10MB", type: "error" });
      return;
    }

    setAttachedFile(file);
    showToast({
      message: `Файл ${file.name} выбран`,
      type: "success",
    });
  };

  const deleteAttachedFile = async () => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/files/${attachedFileData?.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttachedFile(null);
      setAttachedFileData(null);
      showToast({ message: "Файл удален", type: "success" });
    } catch (error) {
      showToast({ message: "Ошибка удаления файла", type: "error" });
    }
  };

  const fetchPresignedUrl = async (fileId: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/files/${fileId}/presigned`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    return data.url;
  };

  useEffect(() => {
    fetchNotes();
  }, [taskId]);

  if (!taskId) return <>TaskId is required</>;
  if (!notes) return <Loader />;

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
                <>
                  <p style={{ margin: "0 0 0.5em 0" }}>{n.content}</p>
                  <hr />
                </>
              )}
              <div className={styles.noteDetails}>
                {n.file && n.file.id && (
                  <>
                    <a
                      href="#"
                      onClick={async (e) => {
                        e.preventDefault();
                        if (n.file && n.file.id) {
                          const url = await fetchPresignedUrl(n.file.id);
                          window.open(url, "_blank");
                        }
                      }}
                      className={styles.noteFileLink}
                    >
                      {n.file.name}
                    </a>
                  </>
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
                    <Button
                      onClick={() => deleteNote(n.id, taskId)}
                      size="small"
                    >
                      Удалить
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noNotes}>Заметок пока нет</div>
      )}
      {taskAssignees?.some((a) => a.user.id === currentUserId) && (
        <div className={styles.newNote}>
          <TextArea
            value={newNote}
            onChange={(e) =>
              setNewNote((e.target as HTMLTextAreaElement).value)
            }
            placeholder="Написать заметку..."
          />
          <div style={{ textAlign: "center" }}>
            <div className={styles.attachFile}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => fileInputRef.current?.click()}
              >
                📎 Файл
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="*"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              {attachedFile && (
                <div>
                  <span style={{ marginLeft: 8 }}>{attachedFile.name}</span>
                  <span
                    style={{ marginLeft: 8, cursor: "pointer", color: "red" }}
                    onClick={deleteAttachedFile}
                  >
                    x
                  </span>
                </div>
              )}
            </div>
            <Button onClick={createNote}>Отправить</Button>
          </div>
        </div>
      )}
    </section>
  );
};
