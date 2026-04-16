'use client';

import { useCallback, useState } from 'react';
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
} from '@/store/api/socialFollowsApi';

/** Return type for useFollow. */
export interface UseFollowReturn {
  /** Whether the current user follows the target. */
  isFollowing: boolean;
  /** Follower count for the target. */
  followerCount: number;
  /** Toggle follow state with optimistic update. */
  toggle: () => Promise<void>;
  /** Whether a request is in flight. */
  isLoading: boolean;
}

/**
 * Manages follow/unfollow state for a user.
 * Performs an optimistic update so the UI responds
 * immediately before the API call settles.
 *
 * @param userId - Target user's ID.
 * @param initialFollowing - Server-side initial state.
 * @returns Follow state and toggle action.
 */
export function useFollow(
  userId: string,
  initialFollowing = false,
): UseFollowReturn {
  const { data: followersData } = useGetFollowersQuery(
    userId,
  );
  const [followUser, { isLoading: following }] =
    useFollowUserMutation();
  const [unfollowUser, { isLoading: unfollowing }] =
    useUnfollowUserMutation();

  const serverFollowing =
    followersData?.isFollowing ?? initialFollowing;
  const [optimistic, setOptimistic] = useState<
    boolean | null
  >(null);
  const isFollowing = optimistic ?? serverFollowing;
  const followerCount = followersData?.count ?? 0;

  const toggle = useCallback(async () => {
    setOptimistic(!isFollowing);
    try {
      if (isFollowing) {
        await unfollowUser(userId).unwrap();
      } else {
        await followUser(userId).unwrap();
      }
      setOptimistic(null);
    } catch {
      setOptimistic(null);
    }
  }, [isFollowing, userId, followUser, unfollowUser]);

  return {
    isFollowing,
    followerCount,
    toggle,
    isLoading: following || unfollowing,
  };
}

export default useFollow;
