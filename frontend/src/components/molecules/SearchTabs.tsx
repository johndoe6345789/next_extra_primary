/**
 * SearchTabs — All / Forum / Wiki / Blog / Shop /
 * Gallery / People filter row for the results page.
 *
 * @module components/molecules/SearchTabs
 */
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { RESULT_TABS } from
  '@/constants/search-type-labels';

/** Props for SearchTabs. */
export interface SearchTabsProps {
  active: string;
  onChange: (tab: string) => void;
}

const ROW: React.CSSProperties = {
  display: 'flex', gap: 8, flexWrap: 'wrap',
  marginBottom: 24,
};

function tabStyle(active: boolean): React.CSSProperties {
  return {
    padding: '6px 14px', borderRadius: 999,
    border: '1px solid '
      + 'var(--md-sys-color-outline-variant)',
    background: active
      ? 'var(--md-sys-color-primary-container)'
      : 'transparent',
    color: active
      ? 'var(--md-sys-color-on-primary-container)'
      : 'inherit',
    cursor: 'pointer', fontSize: 14, fontWeight: 500,
  };
}

/**
 * Pill-style tab row.
 *
 * @param props - Component props.
 */
export const SearchTabs: React.FC<SearchTabsProps> = ({
  active, onChange,
}) => {
  const t = useTranslations('search');
  return (
    <div role="tablist" style={ROW}
      data-testid="search-tabs">
      {RESULT_TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          style={tabStyle(active === tab)}
          data-testid={`search-tab-${tab}`}
        >
          {t(`tabs.${tab}`)}
        </button>
      ))}
    </div>
  );
};

export default SearchTabs;
