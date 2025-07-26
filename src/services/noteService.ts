import axios from "axios";
import type { FetchNotesResponse, NewNoteData, Note } from "../types/note";

const apiKey = import.meta.env.VITE_NOTEHUB_TOKEN;
const baseURL = "https://notehub-public.goit.study/api/notes/";
const headers = { Authorization: `Bearer ${apiKey}` };

interface Params {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async (
  search: string,
  page: number
): Promise<FetchNotesResponse> => {
  const params: Params = { page, perPage: 12 };

  if (search.trim() !== "") {
    // добавляем search только если он не пустой
    params.search = search.trim();
  }

  const response = await axios.get<FetchNotesResponse>(baseURL, {
    params,
    headers,
  });

  return response.data;
};

export const updateNote = async ({
  id,
  title,
  content,
  tag,
}: Note): Promise<Note> => {
  const payload = { title, content, tag };

  const response = await axios.patch<Note>(`${baseURL}${id}`, payload, {
    headers,
  });
  return response.data;
};

// (ожидаемый объект: его тип): тип ожидаемого результата
export const createNote = async (
  noteData: NewNoteData
): Promise<NewNoteData> => {
  const response = await axios.post<Note>(baseURL, noteData, { headers });

  return response.data;
};

export const deleteNote = async (noteId: string) => {
  await axios.delete(`${baseURL}${noteId}`, { headers });
};
