'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import ToggleButtonGroup from '@shared/m3/ToggleButtonGroup';
import ToggleButton from '@shared/m3/ToggleButton';
import { useTranslations } from 'next-intl';
import { TextField, Button } from '../atoms';
import { ChatProvider } from '@/types/chat';
import {
  containerStyle, fieldWrapper,
} from './ChatInputStyles';
import type { ChatInputProps } from
  './ChatInputProps';

export type { ChatInputProps } from
  './ChatInputProps';

/**
 * Chat input bar with provider toggle, text
 * field, and send button.
 */
export const ChatInput: React.FC<ChatInputProps> = ({
  value, onChange, onSend,
  provider, onProvider, disabled,
}) => {
  const t = useTranslations('chat');
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  return (
    <Box style={containerStyle}>
      <ToggleButtonGroup
        value={provider} exclusive size="small"
        aria-label="AI provider"
        onChange={(
          _: unknown,
          v: string | string[] | null,
        ) => {
          if (typeof v === 'string') {
            onProvider(v as ChatProvider);
          }
        }}
      >
        <ToggleButton value={ChatProvider.Anthropic}>
          Claude
        </ToggleButton>
        <ToggleButton value={ChatProvider.OpenAI}>
          OpenAI
        </ToggleButton>
      </ToggleButtonGroup>
      <Box style={fieldWrapper} onKeyDown={onKey}>
        <TextField
          label=""
          placeholder={t('placeholder')}
          value={value}
          onChange={(e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
          >) => onChange(e.target.value)}
          size="small"
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
