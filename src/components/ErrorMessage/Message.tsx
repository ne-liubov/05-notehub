import toast from "react-hot-toast";

export const showErrorSearch = () => {
  toast.error("No notes found matching your search");
};

export const showErrorSave = () => {
  toast.error("Failed to save the note");
};

export const showErrorDelete = () => {
  toast.error("Failed to delete the note");
};

export const showSuccessCreate = () => {
  toast.success("Note successfully created");
};

export const showSuccessUpdate = () => {
  toast.success("Note successfully updated");
};

export const showSuccessDelete = () => {
  toast.success("Note successfully deleted");
};