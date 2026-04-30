'use client';

import React from 'react';
import { Box, Button } from '@shared/m3';
import {
  applyMdAction, type MdAction,
} from './markdownAction';
import s from './MarkdownEditor.module.scss';

/** Toolbar action set. Same smart toggle behaviour
 *  applies to every button: empty selection inserts
 *  the markers and parks the caret between them;
 *  text selection wraps; already-wrapped selection
 *  (or cursor sitting between matching markers)
 *  unwraps. */
const ACTIONS: MdAction[] = [
  { label: 'B', prefix: '**', suffix: '**' },
  { label: 'I', prefix: '_', suffix: '_' },
  { label: '</>', prefix: '`', suffix: '`' },
  { label: 'Code',
    prefix: '\n```\n', suffix: '\n```\n' },
  { label: 'Link', prefix: '[', suffix: '](url)' },
  { label: '• List',
    prefix: '- ', linePrefix: true },
  { label: '1. List',
    prefix: '1. ', linePrefix: true },
  { label: '"', prefix: '> ', linePrefix: true },
];

/** Props for MarkdownToolbar. */
export interface MarkdownToolbarProps {
  /** The textarea this toolbar drives. */
  textareaRef:
    React.RefObject<HTMLTextAreaElement | null>;
  /** Called with the new full text after wrapping. */
  onChange: (next: string) => void;
}

/** Compact phpBB-style markdown formatting toolbar. */
export function MarkdownToolbar({
  textareaRef, onChange,
}: MarkdownToolbarProps): React.ReactElement {
  const handle = (a: MdAction) => () => {
    const el = textareaRef.current;
    if (!el) return;
    const r = applyMdAction(el, a);
    onChange(r.value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(r.caretStart, r.caretEnd);
    });
  };
  return (
    <Box
      className={s.toolbar}
      role="toolbar"
      aria-label="Formatting"
      data-testid="md-toolbar"
    >
      {ACTIONS.map((a) => (
        <Button
          key={a.label}
          type="button"
          size="small"
          variant="text"
          onClick={handle(a)}
          aria-label={a.label}
          testId={`md-tb-${a.label}`}
        >
          {a.label}
        </Button>
      ))}
    </Box>
  );
}

export default MarkdownToolbar;
