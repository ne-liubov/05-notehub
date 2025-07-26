import css from "./SearchBox.module.css";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

interface SearchBoxProps {
  searchValue: string;
  onSearch: (value: string) => void;
}

export default function SearchBox({ searchValue, onSearch }: SearchBoxProps) {
  const [searchText, setSearchText] = useState(""); // текст поиска

  useEffect(() => {
    setSearchText(searchValue); // синхронизация локального состояния с пропом (для очистки при создании таски)
  }, [searchValue]);

  const debounced = useDebouncedCallback((value: string) => {
    onSearch(value); // отправка отложеного запроса
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    debounced(e.target.value); // откладываем сам запрос
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={searchText}
      onChange={handleChange}
    />
  );
}
