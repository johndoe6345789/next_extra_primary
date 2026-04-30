/**
 * Forum RTK Query endpoints (threads/posts/reactions).
 * @module store/api/forumApi
 */
import { baseApi } from './baseApi';
import type {
  ForumPost, ForumThread,
} from '../../types/content';

/** Paginated thread list response. */
export interface ThreadListResponse {
  data: ForumThread[];
  total: number;
  page: number;
}

/** Thread-with-posts detail response. */
export interface ThreadDetailResponse {
  thread: ForumThread;
  posts: ForumPost[];
  /** Current 1-based posts page. */
  postPage: number;
  /** Total non-deleted posts in the thread. */
  postTotal: number;
}

/** Args for the thread list query. */
export interface ThreadListArgs {
  page?: number;
  /** Filter to a single board slug. */
  board?: string;
  /** Page size (default backend = 20, max 100). */
  limit?: number;
}

/** Forum endpoints injected into baseApi. */
export const forumApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getForumThreads: build.query<
      ThreadListResponse, ThreadListArgs
    >({
      query: ({ page = 1, board, limit }) => {
        const qs = new URLSearchParams();
        qs.set('page', String(page));
        if (board) qs.set('board', board);
        if (limit) qs.set('limit', String(limit));
        return `/forum/threads?${qs.toString()}`;
      },
      providesTags: ['Comments'],
    }),
    getForumThread: build.query<
      ThreadDetailResponse,
      { id: string; postPage?: number; limit?: number }
    >({
      query: ({ id, postPage = 1, limit }) => {
        const qs = new URLSearchParams();
        qs.set('postPage', String(postPage));
        if (limit) qs.set('limit', String(limit));
        return `/forum/threads/${id}?${qs.toString()}`;
      },
      providesTags: ['Comments'],
    }),
    createThread: build.mutation<
      ForumThread,
      { title: string; body: string }
    >({
      query: (body) => ({
        url: '/forum/threads', method: 'POST', body,
      }),
      invalidatesTags: ['Comments'],
    }),
    createPost: build.mutation<
      ForumPost,
      {
        threadId: string;
        body: string;
        parentId?: string | null;
      }
    >({
      query: ({ threadId, ...body }) => ({
        url: `/forum/threads/${threadId}/posts`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Comments'],
    }),
    addForumReaction: build.mutation<
      void,
      { postId: string; type: string }
    >({
      query: ({ postId, type }) => ({
        url: `/forum/posts/${postId}/reactions`,
        method: 'POST',
        body: { type },
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
});

export const {
  useGetForumThreadsQuery,
  useGetForumThreadQuery,
  useCreateThreadMutation,
  useCreatePostMutation,
  useAddForumReactionMutation,
} = forumApi;
