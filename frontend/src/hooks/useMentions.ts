'use client';

import { useCallback } from 'react';
import {
  useGetMentionsQuery,
} from '@/store/api/socialApi';
import type { Mention } from '@/types/social';

/** Return type for useMentions. */
export interface UseMentionsReturn {
  /** All mentions for the current user. */
  mentions: Mention[];
  /** Count of unread mentions. */
  unreadCount: number;
  /** Whether mentions are loading. */
  isLoading: boolean;
  /** Refetch mentions from the server. */
  refetch: () => void;
  /** Mark a mention as read by ID. */
  markRead: (id: string) => void;
}

/**
 * Fetches mentions for the current user.
 * Exposes an unread count and a client-side
 * mark-read helper (invalidates on refetch).
 *
 * @returns Mention list and state helpers.
 */
export function useMentions(): UseMentionsReturn {
  const { data, isLoading, refetch } =
    useGetMentionsQuery();

  const mentions: Mention[] = data ?? [];
  const unreadCount = mentions.filter(
    (m) => !m.read,
  ).length;

  const markRead = useCallback(
    async (id: string) => {
      try {
        await fetch(`/api/social/mentions/${id}/read`, {
          method: 'PATCH',
        });
        refetch();
      } catch {
        // silently ignore
      }
    },
    [refetch],
  );

  return {
    mentions,
    unreadCount,
    isLoading,
    refetch,
    markRead,
  };
}

export default useMentions;
