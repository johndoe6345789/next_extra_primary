'use client';

/**
 * Dialog for creating a new forum thread.
 * @module components/molecules/NewThreadDialog
 */
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box, Dialog, DialogTitle, DialogContent, TextField,
} from '@shared/m3';
import { Button } from '@shared/m3/Button';
import { MarkdownEditor } from './MarkdownEditor';

/** Props for NewThreadDialog. */
export interface NewThreadDialogProps {
  open: boolean;
  boardSlug: string;
  onClose(): void;
  onSubmit(title: string, body: string): Promise<void>;
}

/**
 * Modal dialog for composing a new forum thread.
 * Clears state on close.
 */
export function NewThreadDialog({
  open, boardSlug: _slug, onClose, onSubmit,
}: NewThreadDialogProps): React.ReactElement {
  const t = useTranslations('forum');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSub] = useState(false);

  useEffect(() => {
    if (!open) { setTitle(''); setBody(''); }
  }, [open]);

  const ok =
    title.trim().length > 0 && body.trim().length > 0
    && !submitting;

  const handleSubmit = async () => {
    if (!ok) return;
    setSub(true);
    try { await onSubmit(title.trim(), body.trim()); }
    finally { setSub(false); }
  };

  return (
    <Dialog open={open} onClose={onClose}
      maxWidth="md" fullWidth testId="new-thread-dialog"
      aria-labelledby="nt-title"
    >
      <DialogTitle id="nt-title">{t('newThread')}</DialogTitle>
      <DialogContent>
        <Box sx={{
          display: 'flex', flexDirection: 'column',
          gap: 2, pt: 1,
        }}>
          <TextField
            label={t('threadTitle')} value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth disabled={submitting}
            aria-label={t('threadTitle')}
            data-testid="new-thread-title-input"
          />
          <MarkdownEditor
            value={body} onChange={setBody}
            label={t('threadBody')} disabled={submitting}
            testId="new-thread-body-editor"
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSubmit}
              disabled={!ok} aria-label={t('submit')}
              data-testid="new-thread-submit"
            >{t('submit')}</Button>
            <Button variant="outlined" onClick={onClose}
              disabled={submitting}
              aria-label={t('cancelEdit')}
              data-testid="new-thread-cancel"
            >{t('cancelEdit')}</Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default NewThreadDialog;
