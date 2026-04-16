'use client';

import {
  useGetBlogPostQuery,
} from '@/store/api/blogApi';
import type { BlogPost } from '@/types/content';

/** Result of useBlogPost. */
export interface UseBlogPostReturn {
  post: BlogPost | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch a single blog post by slug.
 *
 * @param slug - Post slug.
 * @returns Post + loading/error state.
 */
export function useBlogPost(
  slug: string,
): UseBlogPostReturn {
  const { data, isLoading, error } =
    useGetBlogPostQuery(slug, { skip: !slug });
  return {
    post: data ?? null,
    isLoading,
    error: error ? 'Failed to load post' : null,
  };
}

export default useBlogPost;
