'use client';

import { useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent
  from '@mui/material/DialogContent';
import DialogActions
  from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import labels from '@/constants/ui-labels.json';

/** @brief Props for UploadDialog. */
export interface UploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (key: string, file: File) => void;
  prefix?: string;
  testId?: string;
}

/**
 * @brief Dialog to upload a file to S3.
 * @param props - Dialog properties.
 */
export default function UploadDialog({
  open,
  onClose,
  onUpload,
  prefix = '',
  testId = 'upload-dialog',
}: UploadDialogProps) {
  const [key, setKey] = useState('');
  const [file, setFile] = useState<File | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && !key) setKey(prefix + f.name);
  };

  const handleUpload = () => {
    if (file && key) {
      onUpload(key, file);
      setKey('');
      setFile(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      data-testid={testId}
      aria-label={labels.dialogs.uploadFile}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {labels.dialogs.uploadFile}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Button
            variant="outlined"
            onClick={() => inputRef.current?.click()}
            aria-label={labels.dialogs.selectFile}
          >
            {file?.name ?? labels.dialogs.selectFile}
          </Button>
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={handleFileChange}
            data-testid="file-input"
          />
          <TextField
            fullWidth
            label={labels.dialogs.objectKey}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            data-testid="object-key-input"
            aria-label={labels.dialogs.objectKey}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {labels.dialogs.cancel}
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!file || !key}
        >
          {labels.objects.upload}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
