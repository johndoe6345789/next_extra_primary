'use client';

import React from 'react';
import {
  MarkdownActionDialog,
} from './MarkdownActionDialog';
import { LinkDialog } from './LinkDialog';
import { CodeLangMenu } from './CodeLangMenu';
import type { MdAction } from './markdownActionTypes';

/** Props for MarkdownToolbarDialogs. */
export interface MarkdownToolbarDialogsProps {
  pending: MdAction | null;
  onPickPending: (key: string) => void;
  onCancelPending: () => void;
  linkOpen: boolean;
  linkInitial: string;
  onInsertLink: (text: string, url: string) => void;
  onCancelLink: () => void;
  langAnchor: HTMLElement | null;
  onPickLang: (lang: string) => void;
  onCloseLang: () => void;
}

/** Portal-style overlays (ambiguity dialog, link
 *  dialog, code-language menu). */
export function MarkdownToolbarDialogs(
  p: MarkdownToolbarDialogsProps,
): React.ReactElement {
  return (
    <>
      {p.pending && (
        <MarkdownActionDialog
          title={`Wrap text in a ${p.pending.label}`
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
          onPick={p.onPickPending}
          onCancel={p.onCancelPending}
        />
      )}
      {p.linkOpen && (
        <LinkDialog
          initialText={p.linkInitial}
          onInsert={p.onInsertLink}
          onCancel={p.onCancelLink}
        />
      )}
      {p.langAnchor && (
        <CodeLangMenu
          anchor={p.langAnchor}
          onPick={p.onPickLang}
          onClose={p.onCloseLang}
        />
      )}
    </>
  );
}
