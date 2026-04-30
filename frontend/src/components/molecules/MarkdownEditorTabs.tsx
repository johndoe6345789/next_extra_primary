'use client';

import React from 'react';
import { Box } from '@shared/m3';
import s from './MarkdownEditor.module.scss';

export type MarkdownEditorMode = 'write' | 'preview';

/** Props for MarkdownEditorTabs. */
export interface MarkdownEditorTabsProps {
  mode: MarkdownEditorMode;
  onChange: (m: MarkdownEditorMode) => void;
}

/** Write / Preview tab strip for MarkdownEditor. */
export function MarkdownEditorTabs({
  mode, onChange,
}: MarkdownEditorTabsProps): React.ReactElement {
  const cls = (m: MarkdownEditorMode) =>
    `${s.tab} ${mode === m ? s.tabActive : ''}`;
  return (
    <Box className={s.tabs} role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'write'}
        className={cls('write')}
        onClick={() => onChange('write')}
      >
        Write
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === 'preview'}
        className={cls('preview')}
        onClick={() => onChange('preview')}
      >
        Preview
      </button>
    </Box>
  );
}
