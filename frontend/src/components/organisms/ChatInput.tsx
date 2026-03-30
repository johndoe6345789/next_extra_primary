'use client';

import React from 'react';
import Box from '@metabuilder/m3/Box';
import ToggleButtonGroup from '@metabuilder/m3/ToggleButtonGroup';
import ToggleButton from '@metabuilder/m3/ToggleButton';
import { useTranslations } from 'next-intl';
import { TextField, Button } from '../atoms';
import { ChatProvider } from '@/types/chat';

/** Props for ChatInput sub-component. */
export interface ChatInputProps {
  /** Current text. */
  value: string;
  /** Text change handler. */
  onChange: (v: string) => void;
  /** Send handler. */
  onSend: () => void;
  /** Active provider. */
  provider: ChatProvider;
  /** Provider change handler. */
  onProvider: (p: ChatProvider) => void;
  /** Disable send. */
  disabled: boolean;
}

/**
 * Chat input bar with provider toggle, text
 * field, and send button.
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  provider,
  onProvider,
  disabled,
}) => {
  const t = useTranslations('chat');
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        alignItems: 'flex-end',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
      }}
    >
      <ToggleButtonGroup
        value={provider}
        exclusive
        size="small"
        aria-label="AI provider"
        onChange={(_, v) => v && onProvider(v as ChatProvider)}
      >
        <ToggleButton value={ChatProvider.Anthropic}>Claude</ToggleButton>
        <ToggleButton value={ChatProvider.OpenAI}>OpenAI</ToggleButton>
      </ToggleButtonGroup>
      <Box
        sx={{ flex: 1, minWidth: { xs: '100%', sm: 0 } }}
        onKeyDown={onKey}
      >
        <TextField
          label={t('placeholder')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          multiline
          rows={1}
          testId="chat-input"
        />
      </Box>
      <Button
        onClick={onSend}
        disabled={disabled}
        testId="chat-send"
        ariaLabel={t('send')}
      >
        {t('send')}
      </Button>
    </Box>
  );
};

export default ChatInput;
