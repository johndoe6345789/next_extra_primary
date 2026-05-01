/**
 * Hook for embedding a wiki tree at an arbitrary
 * API base path (e.g. `/wiki` or `/help`).
 * @module hooks/useEmbeddedWikiTree
 */
import { useGetWikiTreeAtQuery } from '../store/api/wikiApi';
import type { WikiTreeNode } from '../types/content';

/** Return type for useEmbeddedWikiTree. */
export interface UseEmbeddedWikiTreeReturn {
  /** Flat tree nodes returned by the API. */
  tree: WikiTreeNode[];
  /** True while the request is in flight. */
  isLoading: boolean;
  /** Human-readable error string, or null. */
  error: string | null;
}

/**
 * Fetches a wiki tree rooted at `apiBase`.
 *
 * @param apiBase - API prefix, e.g. `/wiki` or
 *   `/help`. Skips the query when empty.
 * @returns Tree nodes, loading state, and error.
 */
export function useEmbeddedWikiTree(
  apiBase: string,
): UseEmbeddedWikiTreeReturn {
  const { data, isLoading, error } =
    useGetWikiTreeAtQuery(apiBase, { skip: !apiBase });
  return {
    tree: data ?? [],
    isLoading,
    error: error ? 'Failed to load tree' : null,
  };
}
