/**
 * Gamification API endpoints injected into baseApi.
 * @module store/api/gamificationApi
 */
import { baseApi } from './baseApi';
import type {
  Badge,
  LeaderboardEntry,
  StreakInfo,
  ProgressInfo,
} from '../../types/gamification';

/** Badges, leaderboard, streak, progress endpoints. */
export const gamificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get all available badges. */
    getBadges: build.query<Badge[], void>({
      query: () => '/gamification/badges',
      providesTags: ['Gamification'],
    }),

    /** Get the global leaderboard. */
    getLeaderboard: build.query<
      LeaderboardEntry[],
      { limit?: number }
    >({
      query: ({ limit = 25 }) =>
        `/gamification/leaderboard?limit=${limit}`,
      providesTags: ['Gamification'],
    }),

    /** Get the current user's streak info. */
    getMyStreak: build.query<StreakInfo, void>({
      query: () => '/gamification/streak',
      providesTags: ['Gamification'],
    }),

    /** Get the current user's level progress. */
    getMyProgress: build.query<ProgressInfo, void>({
      query: () => '/gamification/progress',
      providesTags: ['Gamification'],
    }),
  }),
});

export const {
  useGetBadgesQuery,
  useGetLeaderboardQuery,
  useGetMyStreakQuery,
  useGetMyProgressQuery,
} = gamificationApi;
