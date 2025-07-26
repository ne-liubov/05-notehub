import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface NoteModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function NoteModal({ onClose, children }: NoteModalProps) {
  // выход по клику на бекдроп, проверка клика по конкретному месту
  const handleBackdrop = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // выход по клику на Esc, проверка клика по конкретной кнопке
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // запрет скролла при открытии

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // возврат скролла при закрытии
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>{children} </div>
    </div>,
    document.body
  );
}
