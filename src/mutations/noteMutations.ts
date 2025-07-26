import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, updateNote } from "../services/noteService";
import type { Note, NewNoteData } from "../types/note";

export function useNoteMutations(search: string, page: number) {
  const queryClient = useQueryClient();

  const invalidateNotes = () => {
    queryClient.invalidateQueries({ queryKey: ["notes", search, page] });
  };

  const createNoteMutation = useMutation({
    mutationFn: (note: NewNoteData) => createNote(note),
    onSuccess: invalidateNotes,
  });

  const updateNoteMutation = useMutation({
    mutationFn: (note: Note) => updateNote(note),
    onSuccess: invalidateNotes,
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: number) => deleteNote(String(id)),
    onSuccess: invalidateNotes,
  });

  return {
    createNoteMutation,
    updateNoteMutation,
    deleteNoteMutation,
  };
}
