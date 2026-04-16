/**
 * Blog RTK Query endpoints.
 * @module store/api/blogApi
 */
import { baseApi } from './baseApi';
import type {
  BlogPost, BlogPostSummary,
} from '../../types/content';

/** Paginated blog list response. */
export interface BlogListResponse {
  data: BlogPostSummary[];
  total: number;
  page: number;
  perPage: number;
}

/** Blog endpoints injected into baseApi. */
export const blogApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBlogPosts: build.query<
      BlogListResponse,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 10 }) =>
        `/blog/posts?page=${page}&per_page=${perPage}`,
    }),
    getBlogPost: build.query<BlogPost, string>({
      query: (slug) => `/blog/posts/${slug}`,
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
} = blogApi;
