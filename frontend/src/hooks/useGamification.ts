'use client';

import {
  useGetBadgesQuery,
  useGetLeaderboardQuery,
  useGetMyStreakQuery,
  useGetMyProgressQuery,
} from '@/store/api/gamificationApi';
import type {
  Badge,
  LeaderboardEntry,
  StreakInfo,
  ProgressInfo,
} from '@/types/gamification';

/** Return type for the useGamification hook. */
interface UseGamificationReturn {
  /** User's current point total. */
  points: number;
  /** User's current level number. */
  level: number;
  /** All available badges. */
  badges: Badge[];
  /** Current streak information. */
  streak: StreakInfo | null;
  /** Global leaderboard entries. */
  leaderboard: LeaderboardEntry[];
  /** Level progress details. */
  progress: ProgressInfo | null;
  /** Whether any query is loading. */
  isLoading: boolean;
}

/**
 * Aggregates gamification data from multiple RTK
 * Query endpoints into a single convenient hook.
 *
 * @returns Gamification state for the current user.
 */
export function useGamification():
  UseGamificationReturn {
  const {
    data: badges,
    isLoading: badgesLoading,
  } = useGetBadgesQuery();
  const {
    data: leaderboard,
    isLoading: lbLoading,
  } = useGetLeaderboardQuery({ limit: 25 });
  const {
    data: streak,
    isLoading: streakLoading,
  } = useGetMyStreakQuery();
  const {
    data: progress,
    isLoading: progressLoading,
  } = useGetMyProgressQuery();

  return {
    points: progress?.currentPoints ?? 0,
    level: progress?.currentLevel?.level ?? 1,
    badges: badges ?? [],
    streak: streak ?? null,
    leaderboard: leaderboard ?? [],
    progress: progress ?? null,
    isLoading:
      badgesLoading
      || lbLoading
      || streakLoading
      || progressLoading,
  };
}

export default useGamification;
