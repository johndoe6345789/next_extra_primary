'use client';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent
  from '@mui/material/DialogContent';
import DialogActions
  from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import labels from '@/constants/ui-labels.json';

/** @brief Props for ConfirmDialog molecule. */
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  testId?: string;
}

/**
 * @brief Generic confirmation dialog.
 * @param props - ConfirmDialog properties.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  testId = 'confirm-dialog',
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      data-testid={testId}
      aria-label={title}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          {labels.dialogs.cancel}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
        >
          {labels.dialogs.confirm}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
