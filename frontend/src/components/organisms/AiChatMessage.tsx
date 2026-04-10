'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import SmartToyIcon from '@shared/icons/SmartToy';
import PersonIcon from '@shared/icons/Person';
import type { ChatMessage } from '@/types/chat';
import {
  useContrastColor,
} from '@/hooks/useContrastColor';

/** Props for the AiChatMessage organism. */
export interface AiChatMessageProps {
  /** The chat message to render. */
  message: ChatMessage;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Single chat bubble with auto-contrast text.
 * Text color is computed from the bubble's
 * background luminance via WCAG formula.
 *
 * @param props - Component props.
 */
export const AiChatMessage: React.FC<
  AiChatMessageProps
> = ({ message, testId = 'chat-message' }) => {
  const isU = message.role === 'user';
  const time = new Date(message.timestamp)
    .toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  const label =
    `${isU ? 'User' : 'AI'} message at ${time}`;
  const { ref, color } = useContrastColor();

  return (
    <Box
      data-testid={testId}
      aria-label={label}
      sx={{
        display: 'flex',
        mb: 1,
        justifyContent: isU
          ? 'flex-end' : 'flex-start',
      }}
    >
      {!isU && (
        <SmartToyIcon size={18} aria-hidden />
      )}
      <Box
        ref={ref}
        sx={{
          maxWidth: '70%',
          p: 1.5,
          borderRadius: 2,
          bgcolor: isU
            ? 'primary.main' : 'grey.100',
        }}
      >
        <Typography
          variant="body2"
          sx={{ whiteSpace: 'pre-wrap' }}
          style={{ color }}
        >
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          style={{ color, opacity: 0.7 }}
          sx={{
            display: 'block',
            mt: 0.5,
            textAlign: 'right',
          }}
        >
          {time}
        </Typography>
      </Box>
      {isU && (
        <PersonIcon size={18} aria-hidden />
      )}
    </Box>
  );
};

export default AiChatMessage;
