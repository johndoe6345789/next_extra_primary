'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { TextField } from '../atoms';
import { useDebounce } from '@/hooks';

/**
 * Props for the SearchBar component.
 */
export interface SearchBarProps {
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Called with the debounced search value. */
  onSearch: (value: string) => void;
  /** Debounce delay in milliseconds. */
  delay?: number;
  /** Compact size for toolbar use. */
  compact?: boolean;
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * A search text field with debounced onChange.
 * Pressing Escape clears the input. The debounced
 * value is emitted via the onSearch callback.
 *
 * @param props - Component props.
 * @returns The search bar element.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  delay = 300,
  compact = false,
  testId = 'search-bar',
}) => {
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, delay);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setQuery(e.target.value),
    [],
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setQuery('');
  }, []);

  return (
    <div
      className="search-bar"
      data-testid={testId}
      onKeyDown={onKeyDown}
    >
      <TextField
        label={placeholder}
        value={query}
        onChange={handleChange}
        size={compact ? 'small' : undefined}
        testId={`${testId}-input`}
        inputProps={{
          'aria-label': 'Search',
          role: 'searchbox',
        }}
      />
    </div>
  );
};

export default SearchBar;
