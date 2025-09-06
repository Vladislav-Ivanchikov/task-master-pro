import { Button } from "@taskmaster/ui-kit";

type NoteDetailsProps = {
  styles: any;
  n: any;
  currentUserId: string | undefined;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  setEditContent: (content: string) => void;
  updateNote: (id: string) => void;
  deleteNote: (id: string) => void;
  fetchPresignedUrl: (id: string) => Promise<string | null>;
};

export const NoteDetails = ({
  styles,
  n,
  currentUserId,
  editingId,
  setEditingId,
  setEditContent,
  updateNote,
  deleteNote,
  fetchPresignedUrl,
}: NoteDetailsProps) => {
  return (
    <div className={styles.noteDetails}>
      {n.file && n.file.id && (
        <>
          <a
            href="#"
            onClick={async (e) => {
              e.preventDefault();
              if (n.file && n.file.id) {
                const url = await fetchPresignedUrl(n.file.id);
                if (!url) return;
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
                updateNote(n.id);
                setEditContent("");
              }}
              size="small"
            >
              Save
            </Button>
          ) : (
            <Button
              onClick={() => {
                setEditingId(n.id);
                setEditContent(n.content);
              }}
              size="small"
            >
              Edit
            </Button>
          )}
          <Button onClick={() => deleteNote(n.id)} size="small">
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};
