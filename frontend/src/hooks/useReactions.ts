'use client';

import { useCallback } from 'react';
import {
  useGetReactionsQuery,
  useAddReactionMutation,
  useRemoveReactionMutation,
} from '@/store/api/socialApi';
import type { Reaction } from '@/types/social';

/** Params for useReactions. */
export interface UseReactionsParams {
  /** Target entity type (post, comment, etc.). */
  targetType: string;
  /** Target entity ID. */
  targetId: string;
}

/** Return type for useReactions. */
export interface UseReactionsReturn {
  /** List of reactions with counts. */
  reactions: Reaction[];
  /** Whether reactions are loading. */
  isLoading: boolean;
  /** Toggle a reaction emoji. */
  toggle: (emoji: string) => Promise<void>;
}

/**
 * Fetches reactions for a target entity and
 * exposes add/remove actions.
 *
 * @param params - Target type and ID.
 * @returns Reaction list and toggle action.
 */
export function useReactions(
  params: UseReactionsParams,
): UseReactionsReturn {
  const { targetType, targetId } = params;
  const { data, isLoading } = useGetReactionsQuery({
    targetType,
    targetId,
  });

  const [addReaction] = useAddReactionMutation();
  const [removeReaction] = useRemoveReactionMutation();

  const toggle = useCallback(
    async (emoji: string) => {
      const existing = data?.find(
        (r) => r.emoji === emoji,
      );
      const args = { targetType, targetId, emoji };
      if (existing?.reacted) {
        await removeReaction(args).unwrap();
      } else {
        await addReaction(args).unwrap();
      }
    },
    [data, targetType, targetId, addReaction, removeReaction],
  );

  return {
    reactions: data ?? [],
    isLoading,
    toggle,
  };
}

export default useReactions;
