/**
 * SearchResultsList — vertical list of search hits.
 * @module components/molecules/SearchResultsList
 */
'use client';
import React from 'react';
import { Link } from '@/i18n/navigation';
import {
  INDEX_TO_URL_PREFIX,
} from '@/constants/search-type-labels';
import type { SearchHit } from '@/types/search';

/** Props for SearchResultsList. */
export interface SearchResultsListProps {
  hits: SearchHit[];
}

/** Map an ES hit to a frontend URL. */
function hitUrl(hit: SearchHit): string {
  const src = hit._source as Record<string, unknown>;
  const url = typeof src.url === 'string'
    ? src.url : '';
  if (url) return url;
  const slug = typeof src.slug === 'string'
    ? src.slug
    : (typeof src.id === 'string'
      ? src.id : hit._id);
  const prefix = INDEX_TO_URL_PREFIX[hit._index]
    ?? '/';
  return `${prefix}${slug}`;
}

/** Pull a display title from the hit source. */
function hitTitle(hit: SearchHit): string {
  const s = hit._source as Record<string, unknown>;
  return (typeof s.title === 'string' && s.title)
    || (typeof s.name === 'string' && s.name)
    || (typeof s.username === 'string' && s.username)
    || hit._id;
}

/** Pull a snippet from the hit source. */
function hitSnippet(hit: SearchHit): string {
  const s = hit._source as Record<string, unknown>;
  return (typeof s.snippet === 'string' && s.snippet)
    || (typeof s.excerpt === 'string' && s.excerpt)
    || (typeof s.body === 'string'
      ? (s.body as string).slice(0, 200)
      : '');
}

const ITEM: React.CSSProperties = {
  paddingBlock: 14,
  borderBottom:
    '1px solid var(--md-sys-color-outline-variant)',
};

const URL_LINE: React.CSSProperties = {
  fontSize: 12, opacity: 0.7, marginBottom: 4,
};

const TITLE_LINK: React.CSSProperties = {
  fontSize: 18, fontWeight: 600,
  color: 'var(--md-sys-color-primary)',
  textDecoration: 'none',
};

/**
 * Render a list of search hits.
 *
 * @param props - Component props.
 */
export const SearchResultsList: React.FC<
  SearchResultsListProps
> = ({ hits }) => (
  <ul
    data-testid="search-results-list"
    style={{ listStyle: 'none', margin: 0, padding: 0 }}
  >
    {hits.map((hit) => {
      const url = hitUrl(hit);
      return (
        <li key={`${hit._index}-${hit._id}`} style={ITEM}>
          <div style={URL_LINE}>{url}</div>
          <Link href={url} style={TITLE_LINK}>
            {hitTitle(hit)}
          </Link>
          <div style={{ marginTop: 4, opacity: 0.85 }}>
            {hitSnippet(hit)}
          </div>
        </li>
      );
    })}
  </ul>
);

export default SearchResultsList;
