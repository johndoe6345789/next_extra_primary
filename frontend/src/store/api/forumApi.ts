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
}

/** Forum endpoints injected into baseApi. */
export const forumApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getForumThreads: build.query<
      ThreadListResponse,
      { page?: number }
    >({
      query: ({ page = 1 }) =>
        `/forum/threads?page=${page}`,
      providesTags: ['Comments'],
    }),
    getForumThread: build.query<
      ThreadDetailResponse, string
    >({
      query: (id) => `/forum/threads/${id}`,
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
    addReaction: build.mutation<
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
  useAddReactionMutation,
} = forumApi;
