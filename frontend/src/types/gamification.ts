/**
 * Gamification type definitions.
 * @module types/gamification
 */

/** A badge that can be earned by a user. */
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: 'achievement' | 'streak' | 'social' | 'special';
  earnedAt?: string;
}

/** User's current streak information. */
export interface StreakInfo {
  current: number;
  longest: number;
  lastActiveDate: string;
  isActiveToday: boolean;
}

/** A single entry on the leaderboard. */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  points: number;
  level: number;
}

/** Level definition with thresholds. */
export interface Level {
  level: number;
  name: string;
  minPoints: number;
  maxPoints: number;
}

/** Progress toward the next level. */
export interface ProgressInfo {
  currentLevel: Level;
  nextLevel: Level | null;
  currentPoints: number;
  pointsToNext: number;
  percentComplete: number;
}

/** Redux gamification slice state shape. */
export interface GamificationState {
  points: number;
  level: number;
  badges: Badge[];
  streak: StreakInfo | null;
  leaderboard: LeaderboardEntry[];
}
