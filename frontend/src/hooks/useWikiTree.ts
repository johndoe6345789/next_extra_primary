'use client';

import {
  useGetWikiTreeQuery,
} from '@/store/api/wikiApi';
import type {
  WikiTreeNode,
} from '@/types/content';

/** Result of useWikiTree. */
export interface UseWikiTreeReturn {
  tree: WikiTreeNode[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch the wiki tree.
 *
 * @returns Tree nodes + loading/error state.
 */
export function useWikiTree(): UseWikiTreeReturn {
  const { data, isLoading, error } =
    useGetWikiTreeQuery();
  return {
    tree: data ?? [],
    isLoading,
    error: error ? 'Failed to load wiki' : null,
  };
}

export default useWikiTree;
