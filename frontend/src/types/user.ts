/**
 * User profile type definitions.
 * @module types/user
 */

/** Extended user profile. */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

/** Aggregated stats for a user. */
export interface UserStats {
  totalPoints: number;
  level: number;
  badgeCount: number;
  streakDays: number;
  messagesCount: number;
}

/** Profile update request body. */
export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}
