import css from "./App.module.css";

import {
  useQueryClient,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";

import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import NoteModal from "../Modal/Modal";
import { NoteList } from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import { Toaster } from "react-hot-toast";
import {
  showErrorSearch,
  showErrorSave,
  showErrorDelete,
  showSuccessCreate,
  showSuccessUpdate,
  showSuccessDelete,
} from "../ErrorMessage/Message";
import type { Note, NewNoteData } from "../../types/note";
import { fetchNotes } from "../../services/noteService";
import { useNoteMutations } from "../../mutations/noteMutations";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const queryClient = useQueryClient();

  const { data, isFetching, isSuccess } = useQuery({
    queryKey: ["notes", search, page], // ключ кэша: зависит от search и page
    queryFn: () => fetchNotes(search, page),
    enabled: true, // автовыполнение запроса
    placeholderData: keepPreviousData, // показ пред данных до обновления
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    if (isSuccess && notes.length === 0) {
      showErrorSearch();
    }
  }, [isSuccess, notes.length, search]);

  const { createNoteMutation, updateNoteMutation, deleteNoteMutation } =
    useNoteMutations(search, page);

  const handleSearch = (search: string) => {
    setSearch(search);
    setPage(1);
  };

  const openModal = () => {
    setSelectedNote(null); // пустая форма для создания таски
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleSelect = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleAddOrUpdate = async (note: Note | NewNoteData) => {
    try {
      if ("id" in note) {
        await updateNoteMutation.mutateAsync(note); // обновление таски
        showSuccessUpdate();
      } else {
        await createNoteMutation.mutateAsync(note); // создание таски
        showSuccessCreate(); // Сбрасываем поиск и страницу при создании новой заметки
        setSearch("");
        setPage(1);
      }

      queryClient.invalidateQueries({ queryKey: ["notes", search, page] });
      closeModal();
    } catch {
      showErrorSave();
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNoteMutation.mutateAsync(id);
      showSuccessDelete();
    } catch {
      showErrorDelete();
    }
  };

  return (
    <div className={css.app}>
      <Toaster position="top-center" />

      <header className={css.toolbar}>
        <SearchBox searchValue={search} onSearch={handleSearch} />

        {isSuccess && totalPages > 1 && (
          <Pagination page={page} total={totalPages} onChange={setPage} />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isFetching && <Loader />}

      {isModalOpen && (
        <NoteModal onClose={closeModal}>
          <NoteForm
            note={selectedNote ?? undefined}
            onAdd={handleAddOrUpdate}
            onClose={closeModal}
          />
        </NoteModal>
      )}

      {isSuccess && notes.length > 0 && (
        <NoteList
          notes={notes}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
