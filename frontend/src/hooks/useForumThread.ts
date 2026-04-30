'use client';

import {
  useGetForumThreadQuery,
  useCreatePostMutation,
  useAddForumReactionMutation,
} from '@/store/api/forumApi';
import type {
  ForumPost, ForumThread,
} from '@/types/content';

/** Result of useForumThread. */
export interface UseForumThreadReturn {
  thread: ForumThread | null;
  posts: ForumPost[];
  /** Total non-deleted posts across all pages. */
  postTotal: number;
  /** Current 1-based posts page. */
  postPage: number;
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
 * Fetch a forum thread plus one paginated slice of
 * its posts, and expose reply/react mutations.
 */
export function useForumThread(
  threadId: string,
  postPage = 1,
): UseForumThreadReturn {
  const { data, isLoading, error } =
    useGetForumThreadQuery(
      { id: threadId, postPage },
      { skip: !threadId },
    );
  const [createPost] = useCreatePostMutation();
  const [addReaction] = useAddForumReactionMutation();
  return {
    thread: data?.thread ?? null,
    posts: data?.posts ?? [],
    postTotal: data?.postTotal ?? 0,
    postPage: data?.postPage ?? postPage,
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
