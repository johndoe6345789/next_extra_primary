'use client';

import {
  useGetForumThreadsQuery,
  useCreateThreadMutation,
} from '@/store/api/forumApi';
import type { ForumThread } from '@/types/content';

/** Result of useForumThreads. */
export interface UseForumThreadsReturn {
  threads: ForumThread[];
  total: number;
  isLoading: boolean;
  error: string | null;
  createThread: (
    title: string, body: string, board?: string,
  ) => Promise<void>;
}

/** Args for useForumThreads. */
export interface UseForumThreadsArgs {
  page?: number;
  /** Restrict to one board slug. */
  board?: string;
  /** Page size (server clamps to 1..100). */
  limit?: number;
}

/**
 * Fetch a paginated forum thread list, optionally
 * filtered to a single board, and expose a create
 * mutation.
 */
export function useForumThreads(
  arg: number | UseForumThreadsArgs = 1,
): UseForumThreadsReturn {
  const args: UseForumThreadsArgs =
    typeof arg === 'number' ? { page: arg } : arg;
  const { data, isLoading, error } =
    useGetForumThreadsQuery(args);
  const [create] = useCreateThreadMutation();
  return {
    threads: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error ? 'Failed to load threads' : null,
    createThread: async (title, body, board?) => {
      await create({ title, body, board }).unwrap();
    },
  };
}

export default useForumThreads;
