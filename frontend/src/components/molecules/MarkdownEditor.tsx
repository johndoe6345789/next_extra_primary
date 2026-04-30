'use client';

import React, { useRef, useState } from 'react';
import { Box, TextField } from '@shared/m3';
import { MarkdownToolbar } from './MarkdownToolbar';
import { MarkdownView } from './MarkdownView';
import {
  MarkdownEditorTabs, type MarkdownEditorMode,
} from './MarkdownEditorTabs';
import {
  handleMdKeyDown,
} from './markdownToolbarActions';
import s from './MarkdownEditor.module.scss';

/** Props for MarkdownEditor. */
export interface MarkdownEditorProps {
  value: string;
  onChange: (next: string) => void;
  label?: string;
  disabled?: boolean;
  minRows?: number;
  testId?: string;
}

/** Tabbed write/preview markdown editor with a small
 *  formatting toolbar. */
export function MarkdownEditor({
  value, onChange, label = 'Write…',
  disabled = false, minRows = 4, testId,
}: MarkdownEditorProps): React.ReactElement {
  const [mode, setMode] =
    useState<MarkdownEditorMode>('write');
  const ref = useRef<HTMLTextAreaElement | null>(null);

  return (
    <Box
      className={s.editor}
      data-testid={testId ?? 'md-editor'}
    >
      <MarkdownEditorTabs mode={mode} onChange={setMode} />
      {mode === 'write' && (
        <>
          <MarkdownToolbar
            textareaRef={ref}
            onChange={onChange}
          />
          <TextField
            ref={ref as React.Ref<
              HTMLInputElement | HTMLDivElement
            >}
            multiline
            minRows={minRows}
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) =>
              handleMdKeyDown(e, ref, onChange)}
            placeholder={label}
            disabled={disabled}
            aria-label={label}
            data-testid="md-editor-input"
          />
        </>
      )}
      {mode === 'preview' && (
        <Box className={s.preview}
          data-testid="md-editor-preview">
          {value.trim()
            ? <MarkdownView source={value} />
            : <em className={s.empty}>
                Nothing to preview yet…
              </em>}
        </Box>
      )}
    </Box>
  );
}

export default MarkdownEditor;
