'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Button, Typography } from '@shared/m3';
import { MarkdownEditor } from './MarkdownEditor';

/** Props for ForumReplyComposer. */
export interface ForumReplyComposerProps {
  /** Called with reply body on submit. */
  onSubmit: (body: string) => Promise<void>;
  /** Whether a reply is in-flight. */
  disabled?: boolean;
  /** localStorage key for draft persistence — when
   *  set, the body is saved on every change and
   *  restored on mount. Pass a thread-scoped key
   *  (e.g. `forum-draft-42`) so different threads
   *  don't share drafts. */
  storageKey?: string;
}

/**
 * Reply composer placed at the bottom of a thread.
 * Uses the markdown editor (write/preview tabs +
 * formatting toolbar) so the post body can include
 * bold, lists, code blocks, links, etc.
 */
export function ForumReplyComposer({
  onSubmit, disabled = false, storageKey,
}: ForumReplyComposerProps): React.ReactElement {
  const t = useTranslations('forum');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  // Local "submitting" state guards against the
  // double-click race: button stays disabled from
  // the moment we await the network call until the
  // promise resolves (success or error).
  const [submitting, setSubmitting] = useState(false);

  // Restore draft once on mount, then persist on
  // every change. We track `restored` so the first
  // empty render doesn't accidentally clear an
  // existing localStorage draft.
  const restored = useRef(false);
  useEffect(() => {
    if (!storageKey || restored.current) return;
    restored.current = true;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setBody(saved);
    } catch {
      /* private mode / quota */
    }
  }, [storageKey]);
  useEffect(() => {
    if (!storageKey || !restored.current) return;
    try {
      if (body) localStorage.setItem(storageKey, body);
      else localStorage.removeItem(storageKey);
    } catch { /* quota — ignore */ }
  }, [body, storageKey]);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    if (submitting) return;
    const trimmed = body.trim();
    if (!trimmed) {
      setError(t('replyRequired'));
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setBody('');
      setError(null);
    } catch {
      setError(t('replyError'));
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = disabled || submitting;

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
        disabled={isDisabled}
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
        disabled={isDisabled}
        sx={{ mt: 1 }}
        testId="forum-reply-submit"
        aria-label={t('submit')}
      >
        {submitting ? '…' : t('submit')}
      </Button>
    </Box>
  );
}

export default ForumReplyComposer;
