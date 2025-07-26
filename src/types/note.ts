export interface Note {
  id: number;
  title: string;
  content: string;
  tag: NoteTag;
}

export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface NewNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
