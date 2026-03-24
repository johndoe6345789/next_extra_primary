'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
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
 *
 * @param props - Component props.
 */
export const ChatPanel: React.FC<ChatPanelProps> = ({
  testId = 'chat-panel',
}) => {
  const { messages, sendMessage, isStreaming, provider, setProvider } =
    useAiChat();
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
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <ChatMessageList messages={messages} isStreaming={isStreaming} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSend={send}
        provider={provider}
        onProvider={setProvider}
        disabled={isStreaming || !input.trim()}
      />
    </Box>
  );
};

export default ChatPanel;
