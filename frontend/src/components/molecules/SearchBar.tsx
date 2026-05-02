/**
 * SearchBar — self-contained navbar/drawer search.
 * Owns global search state via useGlobalSearch and
 * renders input + autocomplete dropdown.
 *
 * @module components/molecules/SearchBar
 */
'use client';
import React, { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import TextField from '@shared/m3/TextField';
import { useRouter } from '@/i18n/navigation';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import {
  useSearchKeyboardNav,
} from '@/hooks/useSearchKeyboardNav';
import {
  SearchSuggestDropdown,
} from './SearchSuggestDropdown';
import type { SearchSuggestItem } from '@/types/search';

/** Public props for SearchBar. */
export interface SearchBarProps {
  compact?: boolean;
  placeholder?: string;
  testId?: string;
}

const ROOT_STYLE: React.CSSProperties = {
  position: 'relative', width: '100%',
};

/** Self-contained search bar with autocomplete. */
export const SearchBar: React.FC<SearchBarProps> = ({
  compact = false, placeholder, testId = 'search-bar',
}) => {
  const t = useTranslations('common');
  const router = useRouter();
  const {
    query, setQuery, suggest, submit, clear,
  } = useGlobalSearch();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const onPick = useCallback(
    (it: SearchSuggestItem) => {
      router.push(it.url);
      clear();
      setOpen(false);
    },
    [router, clear],
  );

  const onKeyDown = useSearchKeyboardNav({
    suggest, active, setActive,
    setOpen, clear,
    submit: () => submit(), onPick,
  });

  return (
    <div
      data-testid={testId}
      onKeyDown={onKeyDown}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget))
          setOpen(false);
      }}
      style={ROOT_STYLE}
    >
      <TextField
        placeholder={placeholder ?? `${t('search')}...`}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        size={compact ? 'small' : undefined}
        testId={`${testId}-input`}
        inputProps={{ 'aria-label': 'Search' }}
      />
      {open && suggest.length > 0 && (
        <SearchSuggestDropdown
          query={query}
          items={suggest}
          activeIndex={active}
          onHover={setActive}
          onPick={onPick}
          onViewAll={() => { submit(); setOpen(false); }}
        />
      )}
    </div>
  );
};

export default SearchBar;
