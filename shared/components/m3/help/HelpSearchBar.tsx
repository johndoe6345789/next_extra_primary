import React from 'react';
import { testId } from '../../utils/accessibility';

interface HelpSearchBarProps {
  query: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onClear: () => void;
}

/**
 * HelpSearchBar - Search input with clear
 * button for the help modal.
 */
export function HelpSearchBar({
  query,
  onChange,
  onClear,
}: HelpSearchBarProps) {
  return (
    <div
      style={{
        padding: '16px',
        borderBottom:
          '1px solid var(--color-border)',
        display: 'flex',
        gap: '8px',
      }}
    >
      <input
        type="text"
        placeholder="Search documentation..."
        value={query}
        onChange={onChange}
        aria-label="Search documentation"
        data-testid={testId.input(
          'help-search'
        )}
        style={{
          flex: 1,
          padding: '8px 12px',
          border:
            '1px solid var(--color-border)',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      />
      {query && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          style={{
            padding: '8px 16px',
            backgroundColor:
              'var(--color-surface-hover)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default HelpSearchBar;
