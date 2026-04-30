/**
 * Forum reaction RTK Query endpoint.
 * Extracted from forumApi to keep file sizes under 100 lines.
 * @module store/api/forumReactionApi
 */
import { baseApi } from './baseApi';

/** Reaction endpoints injected into baseApi. */
export const forumReactionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
  useAddForumReactionMutation,
} = forumReactionApi;
