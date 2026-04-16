/**
 * Wiki RTK Query endpoints.
 * @module store/api/wikiApi
 */
import { baseApi } from './baseApi';
import type {
  WikiPage, WikiRevision, WikiTreeNode,
} from '../../types/content';

/** Wiki endpoints injected into baseApi. */
export const wikiApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWikiTree: build.query<WikiTreeNode[], void>({
      query: () => '/wiki/pages',
    }),
    getWikiPage: build.query<WikiPage, string>({
      query: (slug) => `/wiki/pages/${slug}`,
    }),
    getWikiRevisions: build.query<
      WikiRevision[], string
    >({
      query: (slug) =>
        `/wiki/pages/${slug}/revisions`,
    }),
  }),
});

export const {
  useGetWikiTreeQuery,
  useGetWikiPageQuery,
  useGetWikiRevisionsQuery,
} = wikiApi;
