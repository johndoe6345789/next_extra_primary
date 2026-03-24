'use client';

import React, { useState, useEffect, useCallback } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
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
  /** Controlled input value. */
  value?: string;
  /** Debounce delay in milliseconds. */
  delay?: number;
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * A search text field with a leading search icon
 * and debounced onChange. Pressing Escape clears
 * the input. The debounced value is emitted via
 * the onSearch callback.
 *
 * @param props - Component props.
 * @returns The search bar element.
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  value: controlledValue,
  delay = 300,
  testId = 'search-bar',
}) => {
  const [query, setQuery] = useState(
    controlledValue ?? '',
  );
  const debounced = useDebounce(query, delay);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  useEffect(() => {
    if (controlledValue !== undefined)
      setQuery(controlledValue);
  }, [controlledValue]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >) => setQuery(e.target.value),
    [],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') setQuery('');
    }, [],
  );

  return (
    <div data-testid={testId} onKeyDown={onKeyDown}>
      <TextField
        label={placeholder}
        value={query}
        onChange={handleChange}
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
