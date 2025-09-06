import { TextArea } from "@taskmaster/ui-kit";
import { NoteDetails } from "./NoteDetails.js";
import { Note } from "@appTypes/Note.js";

type NotesBlockProps = {
  styles: CSSModuleClasses;
  notes: Note[];
  editContent: string;
  currentUserId: string | undefined;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  setEditContent: (content: string) => void;
  updateNote: (id: string) => void;
  deleteNote: (id: string) => void;
  fetchPresignedUrl: (id: string) => Promise<string | null>;
};

export const NotesBlock = ({
  styles,
  notes,
  editContent,
  currentUserId,
  editingId,
  setEditingId,
  setEditContent,
  updateNote,
  deleteNote,
  fetchPresignedUrl,
}: NotesBlockProps) => {
  return (
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
          <NoteDetails
            styles={styles}
            n={n}
            currentUserId={currentUserId}
            editingId={editingId}
            setEditingId={setEditingId}
            setEditContent={setEditContent}
            updateNote={updateNote}
            deleteNote={deleteNote}
            fetchPresignedUrl={fetchPresignedUrl}
          />
        </div>
      ))}
    </div>
  );
};
