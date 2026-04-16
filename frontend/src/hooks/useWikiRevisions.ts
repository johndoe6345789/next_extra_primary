'use client';

import {
  useGetWikiRevisionsQuery,
} from '@/store/api/wikiApi';
import type {
  WikiRevision,
} from '@/types/content';

/** Result of useWikiRevisions. */
export interface UseWikiRevisionsReturn {
  revisions: WikiRevision[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch revision history for a wiki page.
 *
 * @param slug - Page slug.
 * @returns Revisions + loading/error state.
 */
export function useWikiRevisions(
  slug: string,
): UseWikiRevisionsReturn {
  const { data, isLoading, error } =
    useGetWikiRevisionsQuery(slug, {
      skip: !slug,
    });
  return {
    revisions: data ?? [],
    isLoading,
    error: error ? 'Failed to load history' : null,
  };
}

export default useWikiRevisions;
