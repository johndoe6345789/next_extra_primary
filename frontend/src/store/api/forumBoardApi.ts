/**
 * Forum board admin RTK Query endpoints.
 * Provides board listing and admin update.
 * @module store/api/forumBoardApi
 */
import { baseApi } from './baseApi';
import type {
  ForumBoard,
  ForumBoardPatch,
} from '../../types/forumBoard';

/** Forum board endpoints injected into baseApi. */
export const forumBoardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Fetch all forum boards from the backend.
     * Falls back to static JSON in the hook layer.
     */
    getForumBoards: build.query<ForumBoard[], void>({
      query: () => '/forum/boards',
      providesTags: ['ForumBoards'],
    }),
    /**
     * Admin: update a forum board's settings.
     * @param slug - Board identifier.
     * @param patch - Fields to update.
     */
    updateForumBoard: build.mutation<
      ForumBoard,
      { slug: string } & ForumBoardPatch
    >({
      query: ({ slug, ...patch }) => ({
        url: `/forum/boards/${slug}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['ForumBoards'],
    }),
  }),
});

export const {
  useGetForumBoardsQuery,
  useUpdateForumBoardMutation,
} = forumBoardApi;
