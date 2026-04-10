'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  useSendMessageMutation,
  useGetChatHistoryQuery,
  useClearHistoryMutation,
} from '@/store/api/chatApi';
import {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} from '@/store/api/preferencesApi';
import { ChatProvider } from '@/types/chat';
import matchError from './matchChatError';
import type { UseAiChatReturn } from './useAiChatReturn';

/** Manages AI chat state with provider sync. */
export function useAiChat(): UseAiChatReturn {
  const t = useTranslations();
  const [provider, setLocal] =
    useState<ChatProvider>(
      ChatProvider.Anthropic,
    );
  const [error, setError] =
    useState<string | null>(null);

  const { data: prefs } =
    useGetPreferencesQuery();
  const [updatePrefs] =
    useUpdatePreferencesMutation();

  useEffect(() => {
    if (prefs?.aiProvider) {
      setLocal(
        prefs.aiProvider === 'openai'
          ? ChatProvider.OpenAI
          : ChatProvider.Anthropic,
      );
    }
  }, [prefs?.aiProvider]);

  const setProvider = useCallback(
    (p: ChatProvider) => {
      setLocal(p);
      const bp = p === ChatProvider.OpenAI
        ? 'openai' : 'claude';
      updatePrefs({
        aiProvider: bp as 'claude' | 'openai',
      });
    },
    [updatePrefs],
  );

  const { data, isLoading } =
    useGetChatHistoryQuery({ page: 1 });
  const [sendMut, { isLoading: sending }] =
    useSendMessageMutation();
  const [clearMut] = useClearHistoryMutation();

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);
      try {
        await sendMut({
          message: content, provider,
        }).unwrap();
      } catch (e: unknown) {
        const body =
          (e as Record<string, unknown>)
            ?.data as Record<string, unknown>
            | undefined;
        const raw =
          (body?.error as string) ?? '';
        setError(matchError(raw, t));
      }
    },
    [sendMut, provider, t],
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
    error,
    clearError: () => setError(null),
  };
}

export default useAiChat;
