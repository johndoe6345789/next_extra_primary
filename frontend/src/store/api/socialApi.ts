/**
 * Social DM, reactions, and mentions endpoints.
 * @module store/api/socialApi
 */
import { baseApi } from './baseApi';
import type { DmThread, DmMessage, Reaction,
  Mention } from '@/types/social';

/** DM, reactions, and mentions endpoints. */
export const socialApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    /** List DM threads. */
    getDmThreads: build.query<DmThread[], void>({
      query: () => '/social/dm/threads',
      providesTags: ['Social'],
    }),
    /** Get messages in a thread. */
    getDmMessages: build.query<DmMessage[], string>({
      query: (id) =>
        `/social/dm/threads/${id}/messages`,
      providesTags: ['Social'],
    }),
    /** Send a DM message. */
    sendDmMessage: build.mutation<
      DmMessage,
      { threadId: string; content: string }
    >({
      query: ({ threadId, content }) => ({
        url: `/social/dm/threads/${threadId}/messages`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Social'],
    }),
    /** Create a new DM thread. */
    createDmThread: build.mutation<
      DmThread,
      { participantId: string }
    >({
      query: (body) => ({
        url: '/social/dm/threads',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Social'],
    }),
    /** Get reactions for a target. */
    getReactions: build.query<
      Reaction[],
      { targetType: string; targetId: string }
    >({
      query: ({ targetType, targetId }) =>
        `/social/reactions?target_type=${targetType}` +
        `&target_id=${targetId}`,
      providesTags: ['Social'],
    }),
    /** Add a reaction. */
    addReaction: build.mutation<
      void,
      { targetType: string; targetId: string; emoji: string }
    >({
      query: (body) => ({
        url: '/social/reactions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Social'],
    }),
    /** Remove a reaction. */
    removeReaction: build.mutation<
      void,
      { targetType: string; targetId: string; emoji: string }
    >({
      query: (body) => ({
        url: '/social/reactions',
        method: 'DELETE',
        body,
      }),
      invalidatesTags: ['Social'],
    }),
    /** Get mentions for the current user. */
    getMentions: build.query<Mention[], void>({
      query: () => '/social/mentions',
      providesTags: ['Social'],
    }),
  }),
});

export const {
  useGetDmThreadsQuery,
  useGetDmMessagesQuery,
  useSendDmMessageMutation,
  useCreateDmThreadMutation,
  useGetReactionsQuery,
  useAddReactionMutation,
  useRemoveReactionMutation,
  useGetMentionsQuery,
} = socialApi;
