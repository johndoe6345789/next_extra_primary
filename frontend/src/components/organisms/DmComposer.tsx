'use client';

import React, { useState } from 'react';
import { Box } from '@shared/m3';
import { Button } from '@shared/m3/Button';
import { TextField } from '../atoms';
import { useTranslations } from 'next-intl';

/** Props for DmComposer. */
export interface DmComposerProps {
  /** Called with the message content to send. */
  onSend: (content: string) => Promise<void>;
  /** Whether a send is in flight. */
  isSending?: boolean;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Message composer bar at the bottom of the DM pane.
 * Clears the input after a successful send.
 *
 * @param props - Component props.
 */
export const DmComposer: React.FC<DmComposerProps> = ({
  onSend,
  isSending = false,
  testId = 'dm-composer',
}) => {
  const t = useTranslations('social');
  const [value, setValue] = useState('');

  const handleSend = async () => {
    if (!value.trim()) return;
    await onSend(value);
    setValue('');
  };

  const handleKey = (
    e: React.KeyboardEvent,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <Box
      data-testid={testId}
      aria-label={t('composeMessage')}
      sx={{
        display: 'flex',
        gap: 1,
        p: 1.5,
        borderTop: '1px solid var(--m3-outline-variant)',
      }}
    >
      <TextField
        label={t('typeMessage')}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isSending}
        testId={`${testId}-input`}
        fullWidth
        size="small"
        multiline={false}
        inputProps={{
          onKeyDown: handleKey,
          'aria-label': t('typeMessage'),
        }}
      />
      <Button
        variant="contained"
        onClick={() => void handleSend()}
        disabled={isSending || !value.trim()}
        aria-label={t('sendMessage')}
        testId={`${testId}-send`}
      >
        {t('send')}
      </Button>
    </Box>
  );
};

export default DmComposer;
