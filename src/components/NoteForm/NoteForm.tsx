import css from "./NoteForm.module.css";
import { useId } from "react";
import type { Note, NewNoteData } from "../../types/note";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

interface NoteFormProps {
  onClose: () => void;
  onAdd: (note: Note | NewNoteData) => Promise<void>;
  note?: Note;
}

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title  must be at least 3 characters")
    .max(50, "Title  is too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Content  is too long"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onClose, onAdd, note }: NoteFormProps) {
  const titleId = useId();
  const contentId = useId();
  const tagId = useId();

  const initialValues: NewNoteData = note
    ? { title: note.title, content: note.content, tag: note.tag }
    : { title: "", content: "", tag: "Todo" };

  const handleSubmit = async (
    values: NewNoteData,
    actions: FormikHelpers<NewNoteData>
  ) => {
    if (note) {
      await onAdd({ ...note, ...values }); // обновление с id
    } else {
      await onAdd(values); // создание без id
    }

    actions.resetForm();
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${titleId}-title`}>Title</label>
          <Field
            id={`${titleId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${contentId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${contentId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${tagId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${tagId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" onClick={onClose} className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            {note ? "Update note" : "Create note"}{" "}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
