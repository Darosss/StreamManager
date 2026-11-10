import { useState } from "react";

interface NotesEditorProps {
  initialNotes: string;
  onChange: (value: string) => void;
}

export default function NotesEditor({
  initialNotes,
  onChange,
}: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes);
  return (
    <textarea
      className="textarea-profile-edit"
      value={notes}
      onChange={(e) => {
        const value = e.target.value;
        setNotes(value);
        onChange(value);
      }}
    />
  );
}
