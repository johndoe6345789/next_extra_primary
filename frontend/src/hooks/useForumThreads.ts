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
    title: string, body: string,
  ) => Promise<void>;
}

/**
 * Fetch forum thread list + expose create.
 *
 * @param page - 1-indexed page number.
 * @returns Threads and mutation helpers.
 */
export function useForumThreads(
  page = 1,
): UseForumThreadsReturn {
  const { data, isLoading, error } =
    useGetForumThreadsQuery({ page });
  const [create] = useCreateThreadMutation();
  return {
    threads: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error ? 'Failed to load threads' : null,
    createThread: async (title, body) => {
      await create({ title, body }).unwrap();
    },
  };
}

export default useForumThreads;
