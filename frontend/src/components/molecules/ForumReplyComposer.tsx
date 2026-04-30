'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Button, Typography } from '@shared/m3';
import { MarkdownEditor } from './MarkdownEditor';

/** Props for ForumReplyComposer. */
export interface ForumReplyComposerProps {
  /** Called with reply body on submit. */
  onSubmit: (body: string) => Promise<void>;
  /** Whether a reply is in-flight. */
  disabled?: boolean;
}

/**
 * Reply composer placed at the bottom of a thread.
 * Uses the markdown editor (write/preview tabs +
 * formatting toolbar) so the post body can include
 * bold, lists, code blocks, links, etc.
 */
export function ForumReplyComposer({
  onSubmit, disabled = false,
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
      <MarkdownEditor
        value={body}
        onChange={setBody}
        label={t('replyPlaceholder')}
        disabled={disabled}
        minRows={4}
        testId="forum-reply-input"
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
