'use client';

/**
 * Hook for admin forum board management.
 * @module hooks/useAdminForumBoards
 */
import {
  useGetForumBoardsQuery,
  useUpdateForumBoardMutation,
} from '@/store/api/forumBoardApi';
import type {
  ForumBoard,
  ForumBoardPatch,
} from '@/types/forumBoard';

/** Return type for useAdminForumBoards. */
export interface UseAdminForumBoardsReturn {
  boards: ForumBoard[];
  /**
   * Apply a partial update to a board.
   * @param slug - Board identifier.
   * @param patch - Fields to update.
   */
  update: (
    slug: string, patch: ForumBoardPatch,
  ) => Promise<void>;
  /** True while a mutation is in flight. */
  isSaving: boolean;
}

/**
 * Provides forum board list and admin update action.
 *
 * @returns boards, update function, isSaving flag.
 */
export function useAdminForumBoards(): UseAdminForumBoardsReturn {
  const { data } = useGetForumBoardsQuery();
  const [updateBoard, { isLoading: isSaving }] =
    useUpdateForumBoardMutation();
  const boards = data ?? [];

  const update = async (
    slug: string, patch: ForumBoardPatch,
  ): Promise<void> => {
    await updateBoard({ slug, ...patch }).unwrap();
  };

  return { boards, update, isSaving };
}

export default useAdminForumBoards;
