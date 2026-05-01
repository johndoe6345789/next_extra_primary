'use client';

/**
 * Hook for fetching a single wiki page by slug.
 * Resolves slug → numeric ID via the cached tree.
 * @module hooks/useWikiPage
 */

import {
  useGetWikiTreeQuery,
  useGetWikiPageQuery,
} from '@/store/api/wikiApi';
import type { WikiPage, WikiTreeNode } from '@/types/content';

/** Result of useWikiPage. */
export interface UseWikiPageReturn {
  page: WikiPage | null;
  isLoading: boolean;
  error: string | null;
}

/** Recursively find a node ID by slug. */
function findId(
  nodes: WikiTreeNode[],
  slug: string,
): number | null {
  for (const n of nodes) {
    if (n.slug === slug) return n.id;
    const found = findId(n.children ?? [], slug);
    if (found !== null) return found;
  }
  return null;
}

/**
 * Fetch a wiki page by URL slug.
 * Uses the cached tree to resolve slug → DB id.
 *
 * @param slug - URL slug, e.g. `getting-started`.
 * @returns Page data, loading state, and error.
 */
export function useWikiPage(
  slug: string,
): UseWikiPageReturn {
  const { data: tree, isLoading: treeLoading } =
    useGetWikiTreeQuery();
  const id = findId(tree ?? [], slug);
  const {
    data, isLoading: pageLoading, error,
  } = useGetWikiPageQuery(
    id ?? 0,
    { skip: !id },
  );
  return {
    page: data ?? null,
    isLoading: treeLoading || pageLoading,
    error: error ? 'Failed to load page' : null,
  };
}

export default useWikiPage;
