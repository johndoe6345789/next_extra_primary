'use client';

import React from 'react';
import Box from '@metabuilder/m3/Box';
import Typography from '@metabuilder/m3/Typography';
import SmartToyIcon from '@metabuilder/icons/SmartToy';
import PersonIcon from '@metabuilder/icons/Person';
import type { ChatMessage } from '@/types/chat';

/** Props for the AiChatMessage organism. */
export interface AiChatMessageProps {
  /** The chat message to render. */
  message: ChatMessage;
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Single chat bubble. User messages right,
 * AI messages left with provider icon.
 * Pre-wrapped content and timestamp.
 *
 * @param props - Component props.
 */
export const AiChatMessage: React.FC<AiChatMessageProps> = ({
  message,
  testId = 'chat-message',
}) => {
  const isU = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const label = `${isU ? 'User' : 'AI'} message at ${time}`;

  return (
    <Box
      data-testid={testId}
      aria-label={label}
      sx={{
        display: 'flex',
        mb: 1,
        justifyContent: isU ? 'flex-end' : 'flex-start',
      }}
    >
      {!isU && (
        <SmartToyIcon fontSize="small" sx={{ mr: 1, mt: 0.5 }} aria-hidden />
      )}
      <Box
        sx={{
          maxWidth: '70%',
          p: 1.5,
          borderRadius: 2,
          bgcolor: isU ? 'primary.main' : 'grey.100',
          color: isU ? 'primary.contrastText' : 'text.primary',
        }}
      >
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            opacity: 0.7,
            textAlign: 'right',
          }}
        >
          {time}
        </Typography>
      </Box>
      {isU && (
        <PersonIcon fontSize="small" sx={{ ml: 1, mt: 0.5 }} aria-hidden />
      )}
    </Box>
  );
};

export default AiChatMessage;
