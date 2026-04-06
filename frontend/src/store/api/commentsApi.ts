/**
 * Comments API endpoint injected into baseApi.
 * @module store/api/commentsApi
 */
import { baseApi } from './baseApi';

/** Shape of a comment from the backend. */
export interface CommentItem {
  id: string;
  content: string;
  username: string;
  displayName: string;
  createdAt: string;
}

/** Response from GET /api/comments. */
interface ListResponse {
  comments: CommentItem[];
}

/** Request body for POST /api/comments. */
interface CreateRequest {
  content: string;
}

/** Response from POST /api/comments. */
interface CreateResponse {
  id: string;
  content: string;
  createdAt: string;
}

/** Response from DELETE /api/comments/:id. */
interface DeleteResponse {
  deleted: boolean;
  id?: string;
}

/** Comments CRUD endpoints. */
export const commentsApi =
  baseApi.injectEndpoints({
    endpoints: (build) => ({
      /** Fetch comments with pagination. */
      listComments: build.query<
        CommentItem[],
        { limit?: number; offset?: number }
      >({
        query: ({ limit = 50, offset = 0 }) =>
          `/comments?limit=${limit}&offset=${offset}`,
        transformResponse: (r: ListResponse) =>
          r.comments,
        providesTags: ['Comments'],
      }),
      /** Create a new comment. */
      createComment: build.mutation<
        CreateResponse,
        CreateRequest
      >({
        query: (body) => ({
          url: '/comments',
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Comments'],
      }),
      /** Delete a comment by ID. */
      deleteComment: build.mutation<
        DeleteResponse,
        string
      >({
        query: (id) => ({
          url: `/comments/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Comments'],
      }),
    }),
  });

export const {
  useListCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi;
