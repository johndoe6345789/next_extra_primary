'use client';

import React from 'react';
import { Box, Button, TextField } from '@shared/m3';
import s from './MarkdownActionDialog.module.scss';

/** Props for LinkDialogForm. */
export interface LinkDialogFormProps {
  text: string;
  url: string;
  onTextChange: (v: string) => void;
  onUrlChange: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onCancel: () => void;
  textRef: React.RefObject<HTMLInputElement | null>;
  urlRef: React.RefObject<HTMLInputElement | null>;
}

type FieldRef = React.Ref<
  HTMLInputElement | HTMLDivElement
>;

/** Body for LinkDialog (text + url + actions). Uses
 *  a <div> rather than <form> because the dialog is
 *  often rendered inside another form (e.g. forum
 *  reply) and nested forms are invalid HTML. Enter
 *  in either field still triggers submit. */
export function LinkDialogForm({
  text, url, onTextChange, onUrlChange, onSubmit,
  onCancel, textRef, urlRef,
}: LinkDialogFormProps): React.ReactElement {
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };
  return (
    <Box
      onKeyDown={onKey}
      sx={{ display: 'flex',
        flexDirection: 'column', gap: 1.5 }}
    >
      <TextField
        ref={textRef as FieldRef}
        label="Text"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        fullWidth
        data-testid="link-dialog-text"
      />
      <TextField
        ref={urlRef as FieldRef}
        label="URL"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="https://example.com"
        fullWidth
        required
        data-testid="link-dialog-url"
      />
      <Box className={s.actions}>
        <Button
          type="button"
          variant="contained"
          disabled={!url.trim()}
          onClick={() => onSubmit()}
          testId="link-dialog-insert"
        >
          Insert
        </Button>
        <Button
          type="button"
          variant="text"
          onClick={onCancel}
          testId="link-dialog-cancel"
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
