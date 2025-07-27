import axios from "axios";
import type { Note, NewNote } from "../types/note";

const apiKey = import.meta.env.VITE_NOTEHUB_TOKEN;
const baseURL = "https://notehub-public.goit.study/api/notes";
const headers = { Authorization: `Bearer ${apiKey}` };

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  query: string,
  page: number
): Promise<FetchNotesResponse> => {
  try {
    const res = await axios.get<FetchNotesResponse>(baseURL, {
      params: {
        ...(query !== "" && { search: query }),
        page,
      },
      headers,
    });
    return res.data;
  } catch {
    throw new Error("No notes found matching your search");
  }
};

// (ожидаемый объект: его тип): тип ожидаемого результата
export const createNote = async (noteData: NewNote): Promise<Note> => {
  try {
    const res = await axios.post<Note>(baseURL, noteData, { headers });
    return res.data;
  } catch {
    throw new Error("Failed to save the note");
  }
};

export const deleteNote = async (noteId: number): Promise<Note> => {
  try {
    const res = await axios.delete<Note>(`${baseURL}/${noteId}`, { headers });
    return res.data;
  } catch {
    throw new Error("Failed to delete the note");
  }
};
