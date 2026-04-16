'use client';

import { useGetDmThreadsQuery } from '@/store/api/socialApi';
import type { DmThread } from '@/types/social';

/** Return type for useDmThreads. */
export interface UseDmThreadsReturn {
  /** List of DM threads. */
  threads: DmThread[];
  /** Whether the threads are loading. */
  isLoading: boolean;
  /** Fetch error if any. */
  error: unknown;
  /** Refetch threads manually. */
  refetch: () => void;
}

/**
 * Fetches the current user's DM thread list.
 * Provides the full thread list with participant info,
 * last message preview, and unread counts.
 *
 * @returns DM thread list state.
 */
export function useDmThreads(): UseDmThreadsReturn {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetDmThreadsQuery();

  return {
    threads: data ?? [],
    isLoading,
    error,
    refetch,
  };
}

export default useDmThreads;
