import css from "./NoteForm.module.css";
import { useId } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { FormikHelpers } from "formik";
import type { NewNote } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import { showErrorSave, showSuccessSave } from "../Message/Message";

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

interface FormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteFormProps {
  onClose: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      showSuccessSave();
      onClose();
    },
    onError() {
      showErrorSave();
    },
  });

  const handleSubmit = (
    values: FormValues,
    FormikHelpers: FormikHelpers<FormValues>
  ) => {
    mutation.mutate(values);
    FormikHelpers.resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={NoteFormSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage component="span" name="title" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows="8"
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
