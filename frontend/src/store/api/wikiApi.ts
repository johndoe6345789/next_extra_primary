/**
 * Wiki RTK Query endpoints.
 * @module store/api/wikiApi
 */
import { baseApi } from './baseApi';
import type {
  WikiPage, WikiRevision, WikiTreeNode,
} from '../../types/content';

/** Payload for creating or updating a wiki page. */
export interface WikiPagePayload {
  /** Page title. */
  title: string;
  /** URL-safe slug (used as the page id). */
  slug: string;
  /** Markdown body. */
  bodyMd: string;
  /** Optional parent slug for hierarchy. */
  parentSlug?: string;
  /** Optional editor summary stored in revisions. */
  summary?: string;
}

/** Wiki endpoints injected into baseApi. */
export const wikiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWikiTree: build.query<WikiTreeNode[], void>({
      query: () => '/wiki/tree',
      transformResponse: (r: { tree: WikiTreeNode[] }) =>
        r.tree ?? [],
      providesTags: ['Wiki'],
    }),
    getWikiTreeAt: build.query<WikiTreeNode[], string>({
      query: (apiBase) => `${apiBase}/tree`,
      transformResponse: (r: { tree: WikiTreeNode[] }) =>
        r.tree ?? [],
      providesTags: ['Wiki'],
    }),
    getWikiPage: build.query<WikiPage, number>({
      query: (id) => `/wiki/pages/${id}`,
      transformResponse: (r: {
        slug: string; title: string;
        bodyMd: string; updatedAt?: string;
      }) => ({
        slug: r.slug, title: r.title,
        bodyMd: r.bodyMd ?? '',
        updatedAt: r.updatedAt,
      }),
      providesTags: (_r, _e, id) =>
        [{ type: 'Wiki', id }],
    }),
    getWikiRevisions: build.query<WikiRevision[], number>({
      query: (id) => `/wiki/pages/${id}/revisions`,
      providesTags: (_r, _e, id) =>
        [{ type: 'Wiki', id: `rev-${id}` }],
    }),
    createWikiPage: build.mutation<
      WikiPage, WikiPagePayload
    >({
      query: (body) => ({
        url: '/wiki/pages',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Wiki'],
    }),
    updateWikiPage: build.mutation<
      WikiPage,
      { slug: string } & WikiPagePayload
    >({
      query: ({ slug, ...body }) => ({
        url: `/wiki/pages/${slug}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_r, _e, { slug }) =>
        ['Wiki', { type: 'Wiki', id: slug }],
    }),
    deleteWikiPage: build.mutation<void, string>({
      query: (slug) => ({
        url: `/wiki/pages/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Wiki'],
    }),
  }),
});

export const {
  useGetWikiTreeQuery,
  useGetWikiTreeAtQuery,
  useGetWikiPageQuery,
  useGetWikiRevisionsQuery,
  useCreateWikiPageMutation,
  useUpdateWikiPageMutation,
  useDeleteWikiPageMutation,
} = wikiApi;
