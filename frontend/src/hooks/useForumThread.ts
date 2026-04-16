'use client';

import {
  useGetForumThreadQuery,
  useCreatePostMutation,
  useAddReactionMutation,
} from '@/store/api/forumApi';
import type {
  ForumPost, ForumThread,
} from '@/types/content';

/** Result of useForumThread. */
export interface UseForumThreadReturn {
  thread: ForumThread | null;
  posts: ForumPost[];
  isLoading: boolean;
  error: string | null;
  reply: (
    body: string, parentId?: string | null,
  ) => Promise<void>;
  react: (
    postId: string, type: string,
  ) => Promise<void>;
}

/**
 * Fetch a forum thread + expose reply/react.
 *
 * @param threadId - Thread ID.
 * @returns Thread data and mutation helpers.
 */
export function useForumThread(
  threadId: string,
): UseForumThreadReturn {
  const { data, isLoading, error } =
    useGetForumThreadQuery(threadId, {
      skip: !threadId,
    });
  const [createPost] = useCreatePostMutation();
  const [addReaction] = useAddReactionMutation();
  return {
    thread: data?.thread ?? null,
    posts: data?.posts ?? [],
    isLoading,
    error: error ? 'Failed to load thread' : null,
    reply: async (body, parentId = null) => {
      await createPost({
        threadId, body, parentId,
      }).unwrap();
    },
    react: async (postId, type) => {
      await addReaction({ postId, type }).unwrap();
    },
  };
}

export default useForumThread;
