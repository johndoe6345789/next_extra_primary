/**
 * Blog RTK Query endpoints.
 * Backend contract: GET /blog/articles?status=published
 *   &limit=N&offset=N → { items: [...], total: N }
 * @module store/api/blogApi
 */
import { baseApi } from './baseApi';
import type {
  BlogPost, BlogPostSummary,
} from '../../types/content';

/** Raw article shape from the C++ backend. */
interface BackendArticle {
  id: number;
  slug: string;
  title: string;
  body_md: string;
  body_html: string;
  hero_image: string;
  author_id: string;
  published_at: string;
  status: string;
}

/** Derive a short excerpt from markdown body. */
function excerpt(md: string): string {
  const plain = md
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_`>]/g, '')
    .trim();
  return plain.length > 160
    ? `${plain.slice(0, 157)}…`
    : plain;
}

function toSummary(a: BackendArticle): BlogPostSummary {
  return {
    id: String(a.id),
    slug: a.slug,
    title: a.title,
    excerpt: excerpt(a.body_md),
    coverImage: a.hero_image || undefined,
    publishedAt: a.published_at || undefined,
  };
}

function toPost(a: BackendArticle): BlogPost {
  return {
    ...toSummary(a),
    contentMarkdown: a.body_md,
  };
}

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
      query: ({ page = 1, perPage = 10 }) => {
        const offset = (page - 1) * perPage;
        return `/blog/articles?status=published`
          + `&limit=${perPage}&offset=${offset}`;
      },
      transformResponse: (
        r: { items: BackendArticle[]; total: number },
        _,
        arg,
      ) => ({
        data: (r.items ?? []).map(toSummary),
        total: r.total ?? 0,
        page: arg.page ?? 1,
        perPage: arg.perPage ?? 10,
      }),
    }),
    getBlogPost: build.query<BlogPost, string>({
      query: (slug) =>
        `/blog/articles/slug/${slug}`,
      transformResponse: (r: BackendArticle) =>
        toPost(r),
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
} = blogApi;
