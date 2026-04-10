'use client';

import React, { useState } from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { useAiChat } from '@/hooks';

/** Props for the ChatPanel organism. */
export interface ChatPanelProps {
  /** data-testid attribute. */
  testId?: string;
}

/**
 * Full chat interface: scrollable messages,
 * input field, send button, provider toggle.
 * Shows user-friendly error on failure.
 *
 * @param props - Component props.
 */
export const ChatPanel: React.FC<
  ChatPanelProps
> = ({ testId = 'chat-panel' }) => {
  const {
    messages, sendMessage, isStreaming,
    provider, setProvider, error, clearError,
  } = useAiChat();
  const [input, setInput] = useState('');

  const send = async () => {
    const t = input.trim();
    if (!t) return;
    setInput('');
    await sendMessage(t);
  };

  return (
    <Box
      data-testid={testId}
      aria-label="AI Chat"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
      }}
    >
      <ChatMessageList
        messages={messages}
        isStreaming={isStreaming}
      />
      {error && (
        <Box
          role="alert"
          data-testid="chat-error"
          style={{
            padding: '8px 16px',
            margin: '0 16px 8px',
            borderRadius: '8px',
            background:
              'var(--mat-sys-error-container)',
            cursor: 'pointer',
          }}
          onClick={clearError}
        >
          <Typography
            variant="body2"
            style={{
              color: 'var(--mat-sys-on-error'
                + '-container)',
            }}
          >
            {error}
          </Typography>
        </Box>
      )}
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={send}
        provider={provider}
        onProvider={setProvider}
        disabled={
          isStreaming || !input.trim()
        }
      />
    </Box>
  );
};

export default ChatPanel;
