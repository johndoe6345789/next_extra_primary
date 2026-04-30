'use client';

import React from 'react';
import {
  MarkdownToolbarButtons,
} from './MarkdownToolbarButtons';
import {
  MarkdownToolbarDialogs,
} from './MarkdownToolbarDialogs';
import {
  useMarkdownToolbar,
} from './useMarkdownToolbar';

/** Props for MarkdownToolbar. */
export interface MarkdownToolbarProps {
  textareaRef:
    React.RefObject<HTMLTextAreaElement | null>;
  onChange: (next: string) => void;
}

/** phpBB-style markdown formatting toolbar with
 *  ambiguity dialog, link dialog, and code-language
 *  picker. Logic lives in useMarkdownToolbar. */
export function MarkdownToolbar({
  textareaRef, onChange,
}: MarkdownToolbarProps): React.ReactElement {
  const t = useMarkdownToolbar(textareaRef, onChange);

  return (
    <>
      <MarkdownToolbarButtons
        onAction={t.handle}
        onOpenLink={t.openLink}
        onOpenLang={() =>
          t.setLangAnchor(t.langBtnRef.current)}
        langBtnRef={t.langBtnRef}
      />
      <MarkdownToolbarDialogs
        pending={t.pending}
        onPickPending={t.onPickPending}
        onCancelPending={() => t.setPending(null)}
        linkOpen={t.linkOpen}
        linkInitial={t.linkInitial}
        onInsertLink={t.insertLink}
        onCancelLink={() => t.setLinkOpen(false)}
        langAnchor={t.langAnchor}
        onPickLang={t.insertCodeWithLang}
        onCloseLang={() => t.setLangAnchor(null)}
      />
    </>
  );
}

export default MarkdownToolbar;
