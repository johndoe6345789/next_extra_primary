/**
 * SearchSuggestDropdown — autocomplete panel under
 * the navbar search bar. Lists up to N suggestions
 * plus a "View all results" footer.
 *
 * @module components/molecules/SearchSuggestDropdown
 */
'use client';

import React, { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { SearchSuggestItem } from '@/types/search';
import {
  TYPE_LABEL_KEY,
} from '@/constants/search-type-labels';
import {
  PANEL, LIST, ROW_TOP, BADGE, TITLE, SNIPPET,
  rowStyle, viewAllStyle,
} from './searchSuggestStyles';

/** Props for SearchSuggestDropdown. */
export interface SearchSuggestDropdownProps {
  query: string;
  items: SearchSuggestItem[];
  activeIndex: number;
  onHover: (i: number) => void;
  onPick: (item: SearchSuggestItem) => void;
  onViewAll: () => void;
}

/**
 * Autocomplete dropdown.
 *
 * @param props - Component props.
 */
export const SearchSuggestDropdown: React.FC<
  SearchSuggestDropdownProps
> = ({ query, items, activeIndex, onHover,
  onPick, onViewAll }) => {
  const t = useTranslations('search');
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = listRef.current
      ?.querySelectorAll('li')[activeIndex];
    (el as HTMLElement | undefined)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (items.length === 0) return null;
  return (
    <div
      style={PANEL}
      data-testid="search-suggest-dropdown"
    >
      <ul
        ref={listRef}
        role="listbox"
        aria-label={t('suggestions')}
        style={LIST}
      >
        {items.map((it, i) => (
          <li
            key={`${it.type}-${it.id}`}
            role="option"
            aria-selected={i === activeIndex}
            onMouseEnter={() => onHover(i)}
            onClick={() => onPick(it)}
            data-testid="search-suggest-item"
            style={rowStyle(i === activeIndex)}
          >
            <div style={ROW_TOP}>
              <span style={BADGE}>
                {t(TYPE_LABEL_KEY[it.type]
                  ?? 'tabs.all')}
              </span>
              <span style={TITLE}>{it.title}</span>
            </div>
            <div style={SNIPPET}>{it.snippet}</div>
          </li>
        ))}
        <li
          role="option"
          aria-selected={activeIndex === items.length}
          onClick={onViewAll}
          onMouseEnter={() => onHover(items.length)}
          style={viewAllStyle(
            activeIndex === items.length,
          )}
          data-testid="search-suggest-view-all"
        >
          {t('viewAll', { query })}
        </li>
      </ul>
    </div>
  );
};

export default SearchSuggestDropdown;
