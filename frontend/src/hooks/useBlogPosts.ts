'use client';

import {
  useGetBlogPostsQuery,
} from '@/store/api/blogApi';
import type {
  BlogPostSummary,
} from '@/types/content';

/** Result of useBlogPosts. */
export interface UseBlogPostsReturn {
  posts: BlogPostSummary[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch paginated blog posts.
 *
 * @param page - 1-indexed page number.
 * @param perPage - Items per page.
 * @returns Posts + loading/error state.
 */
export function useBlogPosts(
  page = 1,
  perPage = 10,
): UseBlogPostsReturn {
  const { data, isLoading, error } =
    useGetBlogPostsQuery({ page, perPage });
  return {
    posts: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error ? 'Failed to load posts' : null,
  };
}

export default useBlogPosts;
