'use client';

import {
  useGetActivePollsQuery,
} from '@/store/api/pollsApi';
import type { Poll } from '@/types/content';

/** Result of usePolls. */
export interface UsePollsReturn {
  polls: Poll[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch currently active polls.
 *
 * @returns Polls + loading/error state.
 */
export function usePolls(): UsePollsReturn {
  const { data, isLoading, error } =
    useGetActivePollsQuery();
  return {
    polls: data ?? [],
    isLoading,
    error: error ? 'Failed to load polls' : null,
  };
}

export default usePolls;
