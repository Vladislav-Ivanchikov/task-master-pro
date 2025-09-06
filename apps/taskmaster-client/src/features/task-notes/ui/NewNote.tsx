import { Button, TextArea } from "@taskmaster/ui-kit";

type NewNoteProps = {
  newNote: string;
  setNewNote: (value: string) => void;
  attachedFile: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteAttachedFile: () => void;
  createNote: () => void;
  styles: Record<string, string>;
};

export const NewNote = ({
  newNote,
  setNewNote,
  attachedFile,
  fileInputRef,
  handleFileSelect,
  deleteAttachedFile,
  createNote,
  styles,
}: NewNoteProps) => {
  return (
    <div className={styles.newNote}>
      <TextArea
        value={newNote}
        onChange={(e) => setNewNote((e.target as HTMLTextAreaElement).value)}
        placeholder="Write a note..."
      />
      <div style={{ textAlign: "center" }}>
        <div className={styles.attachFile}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => fileInputRef.current?.click()}
          >
            📎 File
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
        <Button onClick={createNote}>Send</Button>
      </div>
    </div>
  );
};
