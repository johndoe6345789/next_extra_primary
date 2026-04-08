/**
 * Type definitions for FormDialog.
 */

/** Definition of a single form field. */
export type FormField = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
};

/** Props for the FormDialog component. */
export type FormDialogProps = {
  open: boolean;
  title: string;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  onClose: () => void;
  onSubmit: (
    data: Record<string, unknown>
  ) => Promise<void>;
  submitLabel?: string;
  testId?: string;
};
