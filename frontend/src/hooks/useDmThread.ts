'use client';

import { useCallback, useEffect } from 'react';
import {
  useGetDmMessagesQuery,
  useSendDmMessageMutation,
} from '@/store/api/socialApi';
import type { DmMessage } from '@/types/social';
import constants from '@/constants/social.json';

/** Return type for useDmThread. */
export interface UseDmThreadReturn {
  /** Messages in the thread. */
  messages: DmMessage[];
  /** Whether messages are loading. */
  isLoading: boolean;
  /** Send a new message. */
  send: (content: string) => Promise<void>;
  /** Whether a send is in flight. */
  isSending: boolean;
}

/**
 * Manages a single DM thread: fetches messages
 * and polls every 5 s for new ones.
 *
 * @param threadId - Thread to load.
 * @returns Message list and send action.
 */
export function useDmThread(
  threadId: string,
): UseDmThreadReturn {
  const { data, isLoading, refetch } =
    useGetDmMessagesQuery(threadId);

  useEffect(() => {
    const id = setInterval(
      refetch,
      constants.dm.pollIntervalMs,
    );
    return () => clearInterval(id);
  }, [refetch]);

  const [sendMut, { isLoading: isSending }] =
    useSendDmMessageMutation();

  const send = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      await sendMut({ threadId, content }).unwrap();
    },
    [threadId, sendMut],
  );

  return {
    messages: data ?? [],
    isLoading,
    send,
    isSending,
  };
}

export default useDmThread;
