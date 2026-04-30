'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@shared/m3';
import s from './MarkdownActionDialog.module.scss';

/** A choice the user can pick. */
export interface DialogChoice {
  /** Stable id returned in onPick. */
  key: string;
  /** Visible label. */
  label: string;
  /** Style as the primary recommended action. */
  primary?: boolean;
}

/** Props for MarkdownActionDialog. */
export interface MarkdownActionDialogProps {
  /** Headline question. */
  title: string;
  /** Optional secondary explanation line. */
  detail?: string;
  /** The options the user can pick. */
  choices: DialogChoice[];
  /** Called with the chosen key. */
  onPick: (key: string) => void;
  /** Called when the user dismisses the dialog. */
  onCancel: () => void;
  /** data-testid. */
  testId?: string;
}

/**
 * Tiny inline confirmation dialog used by the
 * markdown editor for ambiguous toolbar actions
 * (e.g. "Wrap this text as code OR insert an empty
 * code block?"). Closes on backdrop click, on Esc,
 * or after a choice is made.
 */
export function MarkdownActionDialog({
  title, detail, choices, onPick, onCancel,
  testId = 'md-action-dialog',
}: MarkdownActionDialogProps): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  // Esc cancels; focus the first primary button so
  // Enter accepts it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    document.addEventListener('keydown', onKey);
    const primary = ref.current?.querySelector(
      'button[data-md-primary="true"]',
    ) as HTMLButtonElement | null;
    primary?.focus();
    return () =>
      document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <Box
      className={s.backdrop}
      onClick={onCancel}
      role="presentation"
      data-testid={testId}
    >
      <Box
        ref={ref as React.Ref<HTMLDivElement>}
        className={s.dialog}
        onClick={(e: React.MouseEvent) =>
          e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <Typography
          component="h3"
          className={s.title}
        >
          {title}
        </Typography>
        {detail && (
          <Typography
            component="p"
            className={s.detail}
          >
            {detail}
          </Typography>
        )}
        <Box className={s.actions}>
          {choices.map((c) => (
            <Button
              key={c.key}
              type="button"
              variant={
                c.primary ? 'contained' : 'outlined'
              }
              onClick={() => onPick(c.key)}
              data-md-primary={c.primary
                ? 'true' : undefined}
              testId={`${testId}-${c.key}`}
            >
              {c.label}
            </Button>
          ))}
          <Button
            type="button"
            variant="text"
            onClick={onCancel}
            testId={`${testId}-cancel`}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default MarkdownActionDialog;
