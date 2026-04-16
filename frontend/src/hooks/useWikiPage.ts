'use client';

import {
  useGetWikiPageQuery,
} from '@/store/api/wikiApi';
import type { WikiPage } from '@/types/content';

/** Result of useWikiPage. */
export interface UseWikiPageReturn {
  page: WikiPage | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch a wiki page by slug.
 *
 * @param slug - Page slug.
 * @returns Page + loading/error state.
 */
export function useWikiPage(
  slug: string,
): UseWikiPageReturn {
  const { data, isLoading, error } =
    useGetWikiPageQuery(slug, { skip: !slug });
  return {
    page: data ?? null,
    isLoading,
    error: error ? 'Failed to load page' : null,
  };
}

export default useWikiPage;
