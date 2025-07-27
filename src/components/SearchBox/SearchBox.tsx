import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onSearch: (value: string) => void;
  searchValue: string;
}

export default function SearchBox({ onSearch, searchValue }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      value={searchValue}
      onChange={handleChange}
    />
  );
}
