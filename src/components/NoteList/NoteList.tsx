import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import { useState } from "react";
import { showErrorDelete, showSuccessDelete } from "../Message/Message";

interface NoteListProps {
  notes: Note[];
  onError: (error: string) => void;
}

export default function NoteList({ notes, onError }: NoteListProps) {
  const queryClient = useQueryClient();
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId: number) => deleteNote(noteId),
    onMutate: (noteId: number) => {
      setDeletingNoteId(noteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      showSuccessDelete();
    },
    onError: (error) => {
      onError(error.message);
      showErrorDelete();
    },
    onSettled: () => {
      setDeletingNoteId(null);
    },
  });

  const handleDelete = (noteId: number) => {
    deleteNoteMutation.mutate(noteId);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              onClick={() => {
                handleDelete(note.id);
              }}
              className={css.button}
              disabled={
                deletingNoteId === note.id && deleteNoteMutation.isPending
              }
            >
              {deletingNoteId === note.id && deleteNoteMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
