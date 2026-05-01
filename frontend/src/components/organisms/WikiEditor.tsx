'use client';

/**
 * Shared editor form for wiki pages (create + edit).
 * @module components/organisms/WikiEditor
 */
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Button } from '@shared/m3';
import TextField from '@shared/m3/inputs/TextField';
import { MarkdownEditor } from
  '@/components/molecules/MarkdownEditor';
import type { WikiPagePayload } from
  '@/store/api/wikiApi';

/** Props for WikiEditor. */
export interface WikiEditorProps {
  initialTitle?: string;
  initialSlug?: string;
  initialBody?: string;
  /** Lock slug field in edit mode (cannot rename). */
  slugLocked?: boolean;
  onSubmit: (p: WikiPagePayload) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const toSlug = (v: string): string =>
  v.toLowerCase().replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

/** Controlled form for wiki page content. */
export function WikiEditor({
  initialTitle = '',
  initialSlug = '',
  initialBody = '',
  slugLocked = false,
  onSubmit,
  onCancel,
  isSaving = false,
}: WikiEditorProps): React.ReactElement {
  const t = useTranslations('wiki');
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [body, setBody] = useState(initialBody);
  const [summary, setSummary] = useState('');

  const handleTitle = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => { setTitle(e.target.value);
    if (!slugLocked) setSlug(toSlug(e.target.value)); };

  const handleSubmit = async (
    e: React.FormEvent,
  ): Promise<void> => { e.preventDefault();
    await onSubmit({ title, slug, bodyMd: body, summary }); };

  return (
    <Box component="form" onSubmit={handleSubmit}
      data-testid="wiki-editor"
      sx={{ display: 'flex', flexDirection: 'column',
        gap: 2 }}>
      <TextField label={t('pageTitle')} value={title}
        onChange={handleTitle} required
        aria-label={t('pageTitle')}
        data-testid="wiki-editor-title" />
      <TextField label={t('slugLabel')} value={slug}
        onChange={(e) => setSlug(e.target.value)}
        disabled={slugLocked} required
        aria-label={t('slugLabel')}
        data-testid="wiki-editor-slug" />
      <MarkdownEditor value={body} onChange={setBody}
        label={t('pageContent')} minRows={12}
        disabled={isSaving} testId="wiki-editor-body"
      />
      <TextField label={t('editSummary')} value={summary}
        onChange={(e) => setSummary(e.target.value)}
        aria-label={t('editSummary')}
        data-testid="wiki-editor-summary" />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button type="submit" variant="contained"
          disabled={isSaving} aria-label={t('save')}
          data-testid="wiki-editor-save">
          {isSaving ? t('saving') : t('save')}
        </Button>
        <Button variant="outlined" onClick={onCancel}
          aria-label={t('cancel')}
          data-testid="wiki-editor-cancel">
          {t('cancel')}
        </Button>
      </Box>
    </Box>
  );
}

export default WikiEditor;
