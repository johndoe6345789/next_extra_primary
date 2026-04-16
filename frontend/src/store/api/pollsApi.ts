/**
 * Polls RTK Query endpoints.
 * @module store/api/pollsApi
 */
import { baseApi } from './baseApi';
import type { Poll } from '../../types/content';

/** Poll endpoints injected into baseApi. */
export const pollsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActivePolls: build.query<Poll[], void>({
      query: () => '/polls/active',
    }),
    getPollResults: build.query<Poll, string>({
      query: (id) => `/polls/${id}/results`,
    }),
    votePoll: build.mutation<
      Poll,
      { pollId: string; optionId: string }
    >({
      query: ({ pollId, optionId }) => ({
        url: `/polls/${pollId}/votes`,
        method: 'POST',
        body: { option_id: optionId },
      }),
    }),
  }),
});

export const {
  useGetActivePollsQuery,
  useGetPollResultsQuery,
  useVotePollMutation,
} = pollsApi;
