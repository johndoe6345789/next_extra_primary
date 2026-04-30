'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@shared/m3';
import { useEscToCancel } from './useEscToCancel';
import { LinkDialogForm } from './LinkDialogForm';
import s from './MarkdownActionDialog.module.scss';

/** Props for LinkDialog. */
export interface LinkDialogProps {
  initialText: string;
  onInsert: (text: string, url: string) => void;
  onCancel: () => void;
}

/** Asks the user for link text + URL. Pre-fills text
 *  with the current selection so the common
 *  "select word, click Link, paste URL" flow works
 *  in two clicks. */
export function LinkDialog({
  initialText, onInsert, onCancel,
}: LinkDialogProps): React.ReactElement {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState('');
  const urlRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLInputElement | null>(null);

  useEscToCancel(onCancel);
  useEffect(() => {
    if (initialText) urlRef.current?.focus();
    else textRef.current?.focus();
  }, [initialText]);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim()) return;
    onInsert(text, url.trim());
  };

  return (
    <Box
      className={s.backdrop}
      onClick={onCancel}
      role="presentation"
      data-testid="link-dialog"
    >
      <Box
        className={s.dialog}
        onClick={(e: React.MouseEvent) =>
          e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Insert link"
      >
        <Typography component="h3" className={s.title}>
          Insert link
        </Typography>
        <LinkDialogForm
          text={text}
          url={url}
          onTextChange={setText}
          onUrlChange={setUrl}
          onSubmit={submit}
          onCancel={onCancel}
          textRef={textRef}
          urlRef={urlRef}
        />
      </Box>
    </Box>
  );
}

export default LinkDialog;
