'use client';

/**
 * Inline edit form for a forum post body.
 * @module components/molecules/ForumPostEditForm
 */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box } from '@shared/m3';
import { Button } from '@shared/m3/Button';
import { MarkdownEditor } from './MarkdownEditor';

/** Props for ForumPostEditForm. */
export interface ForumPostEditFormProps {
  /** The current post body to pre-populate the editor. */
  initialBody: string;
  /**
   * Called with the new body when the user saves.
   * Should be async — Save button disables during call.
   */
  onSave(body: string): Promise<void>;
  /** Called when the user cancels editing. */
  onCancel(): void;
  /** Disable all controls externally (e.g. parent loading). */
  disabled?: boolean;
}

/**
 * Renders a MarkdownEditor pre-filled with initialBody,
 * plus Save and Cancel buttons.
 *
 * @param props - initialBody, onSave, onCancel, disabled.
 * @returns Edit form element.
 */
export function ForumPostEditForm({
  initialBody, onSave, onCancel, disabled = false,
}: ForumPostEditFormProps): React.ReactElement {
  const t = useTranslations('forum');
  const [body, setBody] = useState(initialBody);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(body);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      data-testid="forum-post-edit-form"
      aria-label={t('editPost')}
    >
      <MarkdownEditor
        value={body}
        onChange={setBody}
        disabled={disabled || saving}
        testId="post-edit-editor"
      />
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={disabled || saving || !body.trim()}
          aria-label={t('saveEdit')}
          data-testid="post-edit-save"
        >
          {t('saveEdit')}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={saving}
          aria-label={t('cancelEdit')}
          data-testid="post-edit-cancel"
        >
          {t('cancelEdit')}
        </Button>
      </Box>
    </Box>
  );
}

export default ForumPostEditForm;
