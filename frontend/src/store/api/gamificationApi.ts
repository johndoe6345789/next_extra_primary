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

/** Raw badge as returned by the API. */
interface RawBadge {
  id: string;
  name: string;
  description: string;
  icon?: string;
  earned_at?: string;
}

/** Badges, leaderboard, streak, progress endpoints. */
export const gamificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Get all available badges. */
    getBadges: build.query<Badge[], void>({
      query: () => '/gamification/badges',
      transformResponse: (
        res: { badges: RawBadge[] },
      ) => res.badges.map((b) => ({
        id: b.id,
        name: b.name,
        description: b.description,
        iconUrl: b.icon ?? '',
        category: 'achievement' as const,
        earnedAt: b.earned_at,
      })),
      providesTags: ['Gamification'],
    }),

    /** Get the global leaderboard. */
    getLeaderboard: build.query<
      LeaderboardEntry[],
      { limit?: number }
    >({
      query: ({ limit = 25 }) =>
        `/gamification/leaderboard?limit=${limit}`,
      transformResponse: (
        res: { leaderboard: LeaderboardEntry[] },
      ) => res.leaderboard,
      providesTags: ['Gamification'],
    }),

    /** Get the current user's streak info. */
    getMyStreak: build.query<StreakInfo, void>({
      query: () => '/gamification/streaks/me',
      providesTags: ['Gamification'],
    }),

    /** Get the current user's level progress. */
    getMyProgress: build.query<ProgressInfo, void>({
      query: () => '/gamification/progress/me',
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
