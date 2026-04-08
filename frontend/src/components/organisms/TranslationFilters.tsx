'use client';
/**
 * Locale and namespace filter controls for
 * the translation editor.
 */
import { type ReactElement } from 'react';
import { Box } from '@shared/m3';
import { useTranslations } from 'next-intl';

/** Props for TranslationFilters. */
export interface TranslationFiltersProps {
  /** Current locale. */
  locale: string;
  /** Locale setter. */
  setLocale: (v: string) => void;
  /** Available locales. */
  locales: string[];
  /** Current namespace filter. */
  filter: string;
  /** Namespace filter setter. */
  setFilter: (v: string) => void;
  /** Available namespaces. */
  namespaces: string[];
}

/**
 * Renders locale and namespace dropdowns.
 *
 * @param props - Filter props.
 * @returns Filter controls element.
 */
export default function TranslationFilters({
  locale, setLocale, locales,
  filter, setFilter, namespaces,
}: TranslationFiltersProps): ReactElement {
  const ts = useTranslations('settings');
  return (
    <Box
      style={{
        display: 'flex', gap: 16,
        marginBottom: 16, flexWrap: 'wrap',
      }}
    >
      <label>
        {ts('language')}
        <select
          value={locale}
          onChange={(e) =>
            setLocale(e.target.value)}
          aria-label="Select locale"
          data-testid="locale-select"
          style={{
            marginLeft: 8, padding: 4,
          }}
        >
          {locales.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label>
        Namespace
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)}
          aria-label="Filter namespace"
          data-testid="ns-filter"
          style={{
            marginLeft: 8, padding: 4,
          }}
        >
          <option value="">All</option>
          {namespaces.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
    </Box>
  );
}
