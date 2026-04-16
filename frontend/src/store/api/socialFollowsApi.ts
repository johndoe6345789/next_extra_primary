/**
 * Social follows + presence endpoints.
 * @module store/api/socialFollowsApi
 */
import { baseApi } from './baseApi';
import type {
  FollowCounts,
  Presence,
} from '@/types/social';

/** Follow, presence, and mention endpoints. */
export const socialFollowsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Follow a user. */
    followUser: build.mutation<void, string>({
      query: (userId) => ({
        url: `/social/follows/${userId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Social'],
    }),
    /** Unfollow a user. */
    unfollowUser: build.mutation<void, string>({
      query: (userId) => ({
        url: `/social/follows/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Social'],
    }),
    /** Get followers for a user. */
    getFollowers: build.query<FollowCounts, string>({
      query: (userId) =>
        `/social/follows/followers/${userId}`,
      providesTags: ['Social'],
    }),
    /** Get following list for a user. */
    getFollowing: build.query<FollowCounts, string>({
      query: (userId) =>
        `/social/follows/following/${userId}`,
      providesTags: ['Social'],
    }),
    /** Get presence for a user. */
    getPresence: build.query<Presence, string>({
      query: (userId) =>
        `/social/presence/${userId}`,
    }),
  }),
});

export const {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useGetPresenceQuery,
} = socialFollowsApi;
