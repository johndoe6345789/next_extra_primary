'use client';

import { useRef, useState } from 'react';
import { isMdActionAmbiguous } from './markdownAction';
import {
  applyAndWrite, writeBackToTextarea,
} from './markdownToolbarActions';
import type { MdAction } from './markdownActionTypes';

/** State + handlers for MarkdownToolbar. Extracted as
 *  a hook to keep the component file under the
 *  100-LOC project cap. */
export function useMarkdownToolbar(
  textareaRef:
    React.RefObject<HTMLTextAreaElement | null>,
  onChange: (next: string) => void,
) {
  const [pending, setPending] =
    useState<MdAction | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkInitial, setLinkInitial] = useState('');
  const [langAnchor, setLangAnchor] =
    useState<HTMLElement | null>(null);
  const langBtnRef =
    useRef<HTMLButtonElement | null>(null);

  const handle = (a: MdAction) => () => {
    const el = textareaRef.current;
    if (!el) return;
    if (isMdActionAmbiguous(el, a)) {
      setPending(a);
      return;
    }
    applyAndWrite(el, textareaRef, a, onChange);
  };

  const openLink = () => {
    const el = textareaRef.current;
    if (!el) return;
    setLinkInitial(el.value.slice(
      el.selectionStart, el.selectionEnd,
    ));
    setLinkOpen(true);
  };

  const insertLink = (text: string, url: string) => {
    const el = textareaRef.current;
    if (!el) { setLinkOpen(false); return; }
    const before = el.value.slice(0, el.selectionStart);
    const after = el.value.slice(el.selectionEnd);
    const md = `[${text}](${url})`;
    const caret = before.length + md.length;
    writeBackToTextarea(
      el, textareaRef,
      before + md + after, caret, caret, onChange,
    );
    setLinkOpen(false);
  };

  const insertCodeWithLang = (lang: string) => {
    const el = textareaRef.current;
    if (!el) return;
    applyAndWrite(el, textareaRef, {
      label: 'Code',
      prefix: `\`\`\`${lang}\n`,
      suffix: '\n```',
    }, onChange);
  };

  const onPickPending = (key: string) => {
    const el = textareaRef.current;
    if (el && pending) {
      applyAndWrite(
        el, textareaRef, pending, onChange,
        key === 'insert' ? { forceInsert: true } : {},
      );
    }
    setPending(null);
  };

  return {
    pending, setPending,
    linkOpen, setLinkOpen,
    linkInitial,
    langAnchor, setLangAnchor,
    langBtnRef,
    handle, openLink, insertLink,
    insertCodeWithLang, onPickPending,
  };
}
