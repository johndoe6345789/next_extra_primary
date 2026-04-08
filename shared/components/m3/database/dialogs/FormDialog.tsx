'use client';

import {
  Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '../../utils';
import { Button, TextField } from '../../inputs';
import { useFormDialog }
  from './useFormDialog';
import type {
  FormDialogProps, FormField,
} from './formDialogTypes';

export type { FormDialogProps, FormField };

/**
 * FormDialog - A reusable form dialog.
 * Renders a dynamic form from field defs.
 */
export function FormDialog({
  open, title, fields, initialData,
  onClose, onSubmit,
  submitLabel = 'Submit', testId,
}: FormDialogProps) {
  const d = useFormDialog(initialData, open);

  const handleSubmit = async () => {
    d.setLoading(true);
    try {
      await onSubmit(d.formData);
      d.setFormData({});
      onClose();
    } catch (error) {
      console.error(
        'Form submission error:', error
      );
    } finally { d.setLoading(false); }
  };

  const labelId = testId
    ? `${testId}-title` : undefined;

  return (
    <Dialog open={open} onClose={onClose}
      data-testid={testId}
      aria-labelledby={labelId}>
      <DialogTitle id={labelId}>
        {title}
      </DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField key={field.name} fullWidth
            label={field.label}
            type={field.type || 'text'}
            required={field.required}
            value={
              d.formData[field.name] !== undefined
                ? String(d.formData[field.name])
                : String(
                    field.defaultValue ?? '')
            }
            onChange={(e) =>
              d.handleChange(
                field.name, e.target.value
              )}
            disabled={d.loading}
            sx={{ mb: 2 }} />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}
          disabled={d.loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}
          variant="contained"
          disabled={d.loading}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormDialog;
