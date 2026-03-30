/**
 * @file SearchBar.tsx
 * @brief Filter endpoints by path or summary.
 */

import { TextField } from '@metabuilder/m3';

/** @brief Props for SearchBar. */
interface SearchBarProps {
  /** Current search query value. */
  value: string;
  /** Called when the query changes. */
  onChange: (query: string) => void;
}

/**
 * @brief Search input for filtering endpoints.
 * @param props - Component props.
 * @returns TextField element for search.
 */
export default function SearchBar(
  { value, onChange }: SearchBarProps,
) {
  return (
    <div className="search-bar">
      <TextField
        label="Filter endpoints..."
        value={value}
        onChange={(e) => onChange(
          (e.target as HTMLInputElement).value,
        )}
        data-testid="search-bar"
        aria-label="Filter API endpoints"
        style={{ width: '100%' }}
      />
    </div>
  );
}
