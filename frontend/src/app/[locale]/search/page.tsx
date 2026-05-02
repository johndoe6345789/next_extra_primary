'use client';

/**
 * Global search results page.
 *
 * Reads `?q=&type=&page=` from URL, queries the
 * `/api/search` Elasticsearch endpoint via RTK Query,
 * and renders results inside the standard
 * PolishPanel surface used across the app.
 *
 * @module app/[locale]/search/page
 */
import React from 'react';
import { useTranslations } from 'next-intl';
import { Box } from '@shared/m3';
import { PolishPanel } from
  '@/components/molecules/PolishPanel';
import { SearchResultsView } from
  '@/components/organisms/SearchResultsView';

const WRAP: React.CSSProperties = {
  maxWidth: 960, margin: '0 auto', padding: '24px 16px',
};

/**
 * Search results page.
 *
 * @returns The rendered page.
 */
export default function SearchPage(): React.ReactElement {
  const t = useTranslations('search');
  return (
    <Box
      component="main"
      role="main"
      aria-label={t('pageTitle')}
      data-testid="search-page"
      style={WRAP}
    >
      <PolishPanel
        size="comfy"
        ariaLabel={t('pageTitle')}
        testId="search-panel"
      >
        <SearchResultsView />
      </PolishPanel>
    </Box>
  );
}
