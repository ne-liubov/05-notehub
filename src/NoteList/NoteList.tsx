import css from "./NoteList.module.css";
import type { Note } from "../types/note";

interface NoteListProps {
  onSelect: (note: Note) => void;
  onDelete: (id: number) => void;
  notes: Note[];
}

export const NoteList = ({ onSelect, onDelete, notes }: NoteListProps) => {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li
          className={css.listItem}
          key={note.id}
          onClick={() => onSelect(note)}
        >
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={(e) => {
                e.stopPropagation(); // блок открытия модалки
                onDelete(note.id);
              }}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
