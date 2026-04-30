/**
 * Forum RTK Query endpoints (threads/posts).
 * Reactions live in forumReactionApi.ts.
 * @module store/api/forumApi
 */
import { baseApi } from './baseApi';
import type {
  ForumPost, ForumThread,
} from '../../types/content';

/** Paginated thread list response. */
export interface ThreadListResponse {
  data: ForumThread[]; total: number; page: number;
}
/** Thread-with-posts detail response. */
export interface ThreadDetailResponse {
  thread: ForumThread; posts: ForumPost[];
  postPage: number; postTotal: number;
}
/** Args for the thread list query. */
export interface ThreadListArgs {
  page?: number; board?: string; limit?: number;
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
      { title: string; body: string; board?: string }
    >({
      query: (body) => ({
        url: '/forum/threads', method: 'POST', body,
      }),
      invalidatesTags: ['Comments'],
    }),
    createPost: build.mutation<
      ForumPost,
      { threadId: string; body: string; parentId?: string | null }
    >({
      query: ({ threadId, ...body }) => ({
        url: `/forum/threads/${threadId}/posts`,
        method: 'POST', body,
      }),
      invalidatesTags: ['Comments'],
    }),
    updatePost: build.mutation<
      { id: string; body: string; updatedAt: string },
      { id: string; body: string }
    >({
      query: ({ id, body }) => ({
        url: `/forum/posts/${id}`,
        method: 'PATCH',
        body: { body },
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
  useUpdatePostMutation,
} = forumApi;
