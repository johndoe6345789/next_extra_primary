'use client';

import React from 'react';
import { Box, Button } from '@shared/m3';
import s from './MarkdownEditor.module.scss';

/** A single formatting button definition. */
export interface MdAction {
  label: string;
  /** Wraps selection: prefix + selected + suffix.
   *  If selectionLess is set, that text is inserted
   *  when nothing is selected. */
  prefix: string;
  suffix?: string;
  selectionLess?: string;
}

const ACTIONS: MdAction[] = [
  { label: 'B', prefix: '**', suffix: '**',
    selectionLess: 'bold' },
  { label: 'I', prefix: '_', suffix: '_',
    selectionLess: 'italic' },
  { label: '</>', prefix: '`', suffix: '`',
    selectionLess: 'code' },
  { label: 'Code', prefix: '\n```\n',
    suffix: '\n```\n', selectionLess: 'block' },
  { label: 'Link', prefix: '[', suffix: '](url)',
    selectionLess: 'text' },
  { label: '• List', prefix: '\n- ',
    selectionLess: 'item' },
  { label: '1. List', prefix: '\n1. ',
    selectionLess: 'item' },
  { label: '"', prefix: '\n> ',
    selectionLess: 'quoted' },
];

/** Props for MarkdownToolbar. */
export interface MarkdownToolbarProps {
  /** The textarea this toolbar drives. */
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** Called with the new full text after wrapping. */
  onChange: (next: string) => void;
}

function applyAction(
  el: HTMLTextAreaElement, a: MdAction,
): { value: string; caret: number } {
  const { selectionStart: ss, selectionEnd: se,
    value } = el;
  const before = value.slice(0, ss);
  const sel = value.slice(ss, se);
  const after = value.slice(se);
  const inner = sel || a.selectionLess || '';
  const next =
    before + a.prefix + inner + (a.suffix ?? '') + after;
  return {
    value: next,
    caret: before.length + a.prefix.length + inner.length,
  };
}

/** Compact phpBB-style markdown formatting toolbar. */
export function MarkdownToolbar({
  textareaRef, onChange,
}: MarkdownToolbarProps): React.ReactElement {
  const handle = (a: MdAction) => () => {
    const el = textareaRef.current;
    if (!el) return;
    const { value, caret } = applyAction(el, a);
    onChange(value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caret);
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
