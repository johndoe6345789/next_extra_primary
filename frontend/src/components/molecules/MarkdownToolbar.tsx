'use client';

import React, { useState } from 'react';
import { Box, Button } from '@shared/m3';
import {
  applyMdAction, isMdActionAmbiguous,
  type MdAction, type MdActionOptions,
} from './markdownAction';
import {
  MarkdownActionDialog,
} from './MarkdownActionDialog';
import s from './MarkdownEditor.module.scss';

/** Toolbar action set. Smart toggle behaviour
 *  applies to every button: empty selection inserts
 *  markers and parks the caret between them; text
 *  selection wraps; already-wrapped selection (or
 *  cursor inside markers) unwraps. */
const ACTIONS: MdAction[] = [
  { label: 'B', prefix: '**', suffix: '**' },
  { label: 'I', prefix: '_', suffix: '_' },
  { label: '</>', prefix: '`', suffix: '`' },
  // Code-block markers MATCH the literal characters
  // inserted into the text so the unwrap path can
  // spot them on a second click.
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
  // The action waiting on a user choice in the
  // ambiguity dialog (Code on a non-empty line with
  // no selection — wrap it OR insert a new block?).
  const [pending, setPending] =
    useState<MdAction | null>(null);

  const apply = (
    a: MdAction, opts: MdActionOptions = {},
  ) => {
    const el = textareaRef.current;
    if (!el) return;
    const r = applyMdAction(el, a, opts);
    // (1) sync DOM value so a rapid follow-up click
    // reads it; (2) rAF-deferred setSelectionRange
    // so the caret survives React's commit. See the
    // 6-rapid-click regression tests.
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

  const handle = (a: MdAction) => () => {
    const el = textareaRef.current;
    if (!el) return;
    if (isMdActionAmbiguous(el, a)) {
      setPending(a);
      return;
    }
    apply(a);
  };

  return (
    <>
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
      {pending && (
        <MarkdownActionDialog
          title={`Wrap text in a ${pending.label}`
            + ' block, or insert a new empty block?'}
          detail={'You have content but nothing '
            + 'selected — pick what should happen.'}
          choices={[
            { key: 'wrap',
              label: 'Wrap current line',
              primary: true },
            { key: 'insert',
              label: 'Insert empty block' },
          ]}
          onPick={(key) => {
            apply(pending, key === 'insert'
              ? { forceInsert: true } : {});
            setPending(null);
          }}
          onCancel={() => setPending(null)}
        />
      )}
    </>
  );
}

export default MarkdownToolbar;
