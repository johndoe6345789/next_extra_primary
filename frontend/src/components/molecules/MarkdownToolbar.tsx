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
  // Code-block markers must MATCH the literal
  // characters inserted into the text so the
  // unwrap path can spot them on a second click.
  // Anything extra (e.g. a leading \n for prettier
  // separation) gets added by applyWrap when the
  // surrounding context warrants it, not here.
  { label: 'Code',
    prefix: '```\n', suffix: '\n```' },
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
    // Two writes are needed:
    //   (1) Sync DOM value via the native setter so
    //       a rapid follow-up click reads up-to-date
    //       el.value (otherwise a 2nd click in the
    //       same tick reads the stale value and
    //       stacks markers instead of unwrapping).
    //   (2) An rAF-deferred setSelectionRange to
    //       restore the caret AFTER React's commit,
    //       which otherwise collapses selection to
    //       end-of-text and breaks the next toggle.
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, 'value',
    )?.set;
    nativeSetter?.call(el, r.value);
    el.setSelectionRange(r.caretStart, r.caretEnd);
    onChange(r.value);
    requestAnimationFrame(() => {
      const cur = textareaRef.current;
      if (!cur) return;
      cur.focus();
      cur.setSelectionRange(r.caretStart, r.caretEnd);
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
