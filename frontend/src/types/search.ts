/**
 * Search domain types shared between the suggest
 * dropdown, the full results page and the RTK
 * Query API.
 *
 * @module types/search
 */

/** Possible entity types in suggest results. */
export type SearchItemType =
  | 'forum_posts'
  | 'wiki_pages'
  | 'articles'
  | 'products'
  | 'gallery_items'
  | 'users';

/** A single suggest dropdown item. */
export interface SearchSuggestItem {
  type: SearchItemType | string;
  id: string;
  title: string;
  snippet: string;
  url: string;
}

/** Suggest endpoint response. */
export interface SuggestResponse {
  items: SearchSuggestItem[];
}

/** A single hit from the full search endpoint. */
export interface SearchHit {
  _id: string;
  _index: string;
  _score: number;
  _source: Record<string, unknown>;
}

/** Standard Elasticsearch hits envelope. */
export interface SearchResponse {
  hits: {
    total: { value: number } | number;
    hits: SearchHit[];
  };
}

/** Args for the full search query. */
export interface SearchArgs {
  q: string;
  from?: number;
  size?: number;
  type?: string;
}
