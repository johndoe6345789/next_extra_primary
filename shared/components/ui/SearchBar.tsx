'use client';

import React, {
  useState, useCallback, useEffect,
} from 'react';
import TextField from '@shared/m3/TextField';
import { useDebounce } from '@shared/hooks';

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

type CE = React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement
>;

/**
 * A search text field with debounced onChange.
 * Pressing Escape clears the input.
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onSearch(debounced); }, [debounced]);

  const handleChange = useCallback(
    (e: CE) => setQuery(e.target.value),
    [],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') setQuery('');
    },
    [],
  );

  return (
    <div data-testid={testId} onKeyDown={onKeyDown}>
      <TextField
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        size={compact ? 'small' : undefined}
        testId={`${testId}-input`}
        inputProps={{
          'aria-label': 'Search',
        }}
      />
    </div>
  );
};

export default SearchBar;
