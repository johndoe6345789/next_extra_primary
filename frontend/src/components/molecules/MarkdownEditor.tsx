'use client';

import React, { useRef, useState } from 'react';
import { Box, TextField } from '@shared/m3';
import { MarkdownToolbar } from './MarkdownToolbar';
import { MarkdownView } from './MarkdownView';
import s from './MarkdownEditor.module.scss';

/** Props for MarkdownEditor. */
export interface MarkdownEditorProps {
  /** Current markdown source. */
  value: string;
  /** Called on every change. */
  onChange: (next: string) => void;
  /** Field label / placeholder. */
  label?: string;
  /** Disable input + toolbar. */
  disabled?: boolean;
  /** Minimum visible rows in write mode. */
  minRows?: number;
  /** data-testid. */
  testId?: string;
}

type Mode = 'write' | 'preview';

/** Tabbed write/preview markdown editor with a small
 *  formatting toolbar. Built on top of MarkdownView
 *  for the preview, so what you see is what
 *  ForumPost will render. */
export function MarkdownEditor({
  value, onChange, label = 'Write…',
  disabled = false, minRows = 4, testId,
}: MarkdownEditorProps): React.ReactElement {
  const [mode, setMode] = useState<Mode>('write');
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const tab = (m: Mode) => () => setMode(m);
  const tabClass = (m: Mode) =>
    `${s.tab} ${mode === m ? s.tabActive : ''}`;

  return (
    <Box
      className={s.editor}
      data-testid={testId ?? 'md-editor'}
    >
      <Box className={s.tabs} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'write'}
          className={tabClass('write')}
          onClick={tab('write')}
        >
          Write
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'preview'}
          className={tabClass('preview')}
          onClick={tab('preview')}
        >
          Preview
        </button>
      </Box>
      {mode === 'write' && (
        <>
          <MarkdownToolbar
            textareaRef={ref}
            onChange={onChange}
          />
          <TextField
            inputRef={ref}
            multiline
            minRows={minRows}
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
