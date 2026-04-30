'use client';

/**
 * Hook for reading forum boards.
 * Falls back to static JSON when API data is unavailable.
 * @module hooks/useForumBoards
 */
import {
  useGetForumBoardsQuery,
} from '@/store/api/forumBoardApi';
import type { ForumBoard } from '@/types/forumBoard';
import staticBoards from '@/constants/forum-boards.json';

type StaticBoardEntry = {
  label: string;
  description: string;
  icon: string;
  order?: number;
  requiresAuth?: boolean;
  minPosts?: number;
};

/** Build fallback ForumBoard[] from the static JSON. */
function buildFallback(): ForumBoard[] {
  return Object.entries(
    staticBoards as Record<string, StaticBoardEntry>,
  ).map(([slug, v]) => ({
    slug,
    label: v.label,
    description: v.description,
    icon: v.icon,
    requiresAuth: v.requiresAuth ?? false,
    minPosts: v.minPosts ?? 0,
    isGuestVisible: !(v.requiresAuth ?? false),
    sortOrder: v.order ?? 0,
  }));
}

/** Return type for useForumBoards. */
export interface UseForumBoardsReturn {
  boards: ForumBoard[];
  isLoading: boolean;
}

/**
 * Fetches forum boards from the API.
 * Falls back to the static forum-boards.json when the API
 * has not yet responded.
 *
 * @returns boards array and loading flag.
 */
export function useForumBoards(): UseForumBoardsReturn {
  const { data, isLoading } = useGetForumBoardsQuery();
  const boards = data ?? buildFallback();
  return { boards, isLoading };
}

export default useForumBoards;
