/**
 * Search RTK Query endpoints.
 *
 * Backend contract:
 *  - GET /search/suggest?q=<term>&limit=5
 *      → { items: SearchSuggestItem[] }
 *  - GET /search?q=<term>&from=0&size=20
 *      &filter[type]=<type>
 *      → standard Elasticsearch hits envelope
 *
 * @module store/api/searchApi
 */
import { baseApi } from './baseApi';
import type {
  SuggestResponse,
  SearchResponse,
  SearchArgs,
} from '@/types/search';

/** Build the query string for the suggest call. */
function suggestParams(
  q: string, limit: number,
): string {
  const p = new URLSearchParams();
  p.set('q', q);
  p.set('limit', String(limit));
  return p.toString();
}

/** Build the query string for the search call. */
function searchParams(args: SearchArgs): string {
  const p = new URLSearchParams();
  p.set('q', args.q);
  p.set('from', String(args.from ?? 0));
  p.set('size', String(args.size ?? 20));
  if (args.type && args.type !== 'all') {
    p.set('filter[type]', args.type);
  }
  return p.toString();
}

/** Suggest args. */
export interface SuggestArgs {
  q: string;
  limit?: number;
}

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    suggest: builder.query<SuggestResponse, SuggestArgs>({
      query: ({ q, limit = 5 }) =>
        `/search/suggest?${suggestParams(q, limit)}`,
    }),
    search: builder.query<SearchResponse, SearchArgs>({
      query: (args) => `/search?${searchParams(args)}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useSuggestQuery,
  useLazySuggestQuery,
  useSearchQuery,
} = searchApi;
