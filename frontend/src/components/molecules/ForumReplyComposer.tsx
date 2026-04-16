'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@shared/m3';

/** Props for ForumReplyComposer. */
export interface ForumReplyComposerProps {
  /** Called with reply body on submit. */
  onSubmit: (body: string) => Promise<void>;
  /** Whether a reply is in-flight. */
  disabled?: boolean;
}

/**
 * Reply composer placed at the bottom of a thread.
 *
 * @param props - ForumReplyComposer props.
 * @returns Reply form UI.
 */
export function ForumReplyComposer({
  onSubmit,
  disabled = false,
}: ForumReplyComposerProps): React.ReactElement {
  const t = useTranslations('forum');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) {
      setError(t('replyRequired'));
      return;
    }
    try {
      await onSubmit(trimmed);
      setBody('');
      setError(null);
    } catch {
      setError(t('replyError'));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      aria-label={t('replyComposer')}
      data-testid="forum-reply-composer"
      sx={{ mt: 3 }}
    >
      <TextField
        label={t('replyPlaceholder')}
        multiline
        minRows={3}
        fullWidth
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={disabled}
        aria-label={t('replyPlaceholder')}
        data-testid="forum-reply-input"
      />
      {error && (
        <Typography color="error" variant="caption">
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        disabled={disabled}
        sx={{ mt: 1 }}
        testId="forum-reply-submit"
        aria-label={t('submit')}
      >
        {t('submit')}
      </Button>
    </Box>
  );
}

export default ForumReplyComposer;
