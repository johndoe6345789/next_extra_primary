'use client';

import { useState, useCallback } from 'react';
import {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useClearHistoryMutation,
} from '@/store/api/chatApi';
import type { ChatMessage, ChatProvider } from '@/types/chat';

/** Return type for the useAiChat hook. */
interface UseAiChatReturn {
  /** Chronological list of chat messages. */
  messages: ChatMessage[];
  /** Send a message to the active AI provider. */
  sendMessage: (content: string) => Promise<void>;
  /** Whether a response is currently streaming. */
  isStreaming: boolean;
  /** The active AI provider. */
  provider: ChatProvider;
  /** Change the active AI provider. */
  setProvider: (p: ChatProvider) => void;
  /** Clear the entire chat history. */
  clearHistory: () => Promise<void>;
  /** Whether history data is loading. */
  isLoading: boolean;
}

/**
 * Manages AI chat state by combining RTK Query
 * endpoints for sending messages, fetching history,
 * and clearing conversations. Tracks the active
 * provider locally.
 *
 * @returns Chat state and action helpers.
 */
export function useAiChat(): UseAiChatReturn {
  const [provider, setProvider] = useState<ChatProvider>(
    'openai' as ChatProvider,
  );

  const { data, isLoading } = useGetChatHistoryQuery({ page: 1 });
  const [sendMut, { isLoading: sending }] = useSendMessageMutation();
  const [clearMut] = useClearHistoryMutation();

  const sendMessage = useCallback(
    async (content: string) => {
      await sendMut({ content, provider }).unwrap();
    },
    [sendMut, provider],
  );

  const clearHistory = useCallback(async () => {
    await clearMut().unwrap();
  }, [clearMut]);

  return {
    messages: data?.data ?? [],
    sendMessage,
    isStreaming: sending,
    provider,
    setProvider,
    clearHistory,
    isLoading,
  };
}

export default useAiChat;
