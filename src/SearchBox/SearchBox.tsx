import css from "./SearchBox.module.css";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

interface SearchBoxProps {
  onSearch: (value: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [searchText, setSearchText] = useState(""); // текст пошуку

  const debounced = useDebouncedCallback((value: string) => {
    onSearch(value); // відправка відкладеного запиту
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    debounced(e.target.value); // відкладаємо сам запит
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
