'use client';

import React, { useEffect, useRef } from 'react';
import { Box, Button, Typography } from '@shared/m3';
import { useEscToCancel } from './useEscToCancel';
import s from './MarkdownActionDialog.module.scss';

/** A choice the user can pick. `primary` styles
 *  the button as the recommended action. */
export interface DialogChoice {
  key: string;
  label: string;
  primary?: boolean;
}

/** Props for MarkdownActionDialog. */
export interface MarkdownActionDialogProps {
  title: string;
  detail?: string;
  choices: DialogChoice[];
  onPick: (key: string) => void;
  onCancel: () => void;
  testId?: string;
}

/** Tiny inline confirmation dialog for ambiguous
 *  toolbar actions. Closes on backdrop click, Esc,
 *  or after a choice is made. */
export function MarkdownActionDialog({
  title, detail, choices, onPick, onCancel,
  testId = 'md-action-dialog',
}: MarkdownActionDialogProps): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);

  useEscToCancel(onCancel);
  // Focus the primary button so Enter accepts it.
  useEffect(() => {
    const primary = ref.current?.querySelector(
      'button[data-md-primary="true"]',
    ) as HTMLButtonElement | null;
    primary?.focus();
  }, []);

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
        <Typography component="h3" className={s.title}>
          {title}
        </Typography>
        {detail && (
          <Typography component="p" className={s.detail}>
            {detail}
          </Typography>
        )}
        <Box className={s.actions}>
          {choices.map((c) => (
            <Button
              key={c.key}
              type="button"
              variant={c.primary
                ? 'contained' : 'outlined'}
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
