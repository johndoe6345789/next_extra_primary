'use client';

import React, { useRef, useEffect } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import CircularProgress from '@shared/m3/CircularProgress';
import { useTranslations } from 'next-intl';
import { AiChatMessage } from './AiChatMessage';
import type { ChatMessage } from '@/types/chat';

/**
 * Props for the ChatMessageList sub-component.
 */
export interface ChatMessageListProps {
  /** Messages to render. */
  messages: ChatMessage[];
  /** Whether AI is currently streaming. */
  isStreaming: boolean;
}

/**
 * Scrollable message list with auto-scroll,
 * empty state, and streaming indicator.
 */
export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isStreaming,
}) => {
  const t = useTranslations('chat');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages.length]);

  return (
    <Box
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
      data-testid="chat-messages"
      style={{
        flex: 1, overflow: 'auto',
        padding: 16, minHeight: 0,
      }}
    >
      {messages.length === 0 && (
        <Typography color="text.secondary" style={{ textAlign: 'center' }}>
          {t('noMessages')}
        </Typography>
      )}
      {messages.map((m) => (
        <AiChatMessage key={m.id} message={m} testId={`msg-${m.id}`} />
      ))}
      {isStreaming && (
        <Box style={{ textAlign: 'center', padding: '8px 0' }}>
          <CircularProgress size={20} />
        </Box>
      )}
      <div ref={endRef} />
    </Box>
  );
};

export default ChatMessageList;
