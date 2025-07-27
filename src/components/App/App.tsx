import css from "./App.module.css";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import NoteModal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Loader from "../Loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import { showErrorSearch } from "../Message/Message";
import { fetchNotes } from "../../services/noteService";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isFetching, isSuccess, isError, error } = useQuery({
    queryKey: ["notes", search, page], // ключ кэша: зависит от search и page
    queryFn: () => fetchNotes(search, page),
    placeholderData: keepPreviousData, // показ пред данных до обновления
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  // модалка
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch notes"
      );
    } else if (isSuccess && notes.length === 0) {
      showErrorSearch();
    }
  }, [isError, error, isSuccess, notes.length]);

  const handleError = (error: string) => {
    toast.error(error || "Something went wrong");
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

      {isSuccess && notes.length > 0 && (
        <NoteList notes={notes} onError={handleError} />
      )}

      {isModalOpen && (
        <NoteModal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </NoteModal>
      )}
    </div>
  );
}
