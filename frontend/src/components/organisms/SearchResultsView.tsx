/**
 * SearchResultsView — body of the /search page.
 * Loads hits via RTK Query, renders header, tabs,
 * the results list, and prev/next pagination.
 *
 * @module components/organisms/SearchResultsView
 */
'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Box, Typography } from '@shared/m3';
import { Button } from '@shared/m3/Button';
import { Link } from '@/i18n/navigation';
import { useSearchQuery } from '@/store/api/searchApi';
import {
  TAB_TO_TYPE,
} from '@/constants/search-type-labels';
import {
  useSearchPageState,
} from '@/hooks/useSearchPageState';
import { SearchTabs } from
  '../molecules/SearchTabs';
import { SearchResultsList } from
  '../molecules/SearchResultsList';

/** Render the results body. */
export const SearchResultsView: React.FC = () => {
  const t = useTranslations('search');
  const {
    q, tab, page, pageSize, setTab, setPage,
  } = useSearchPageState();
  const { data, isFetching } = useSearchQuery(
    {
      q, from: (page - 1) * pageSize, size: pageSize,
      type: TAB_TO_TYPE[tab] ?? 'all',
    },
    { skip: !q },
  );
  const hits = data?.hits.hits ?? [];
  const total = typeof data?.hits.total === 'number'
    ? data.hits.total
    : (data?.hits.total?.value ?? 0);
  const lastPage = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Box data-testid="search-page-body">
      <Typography variant="h4" component="h1"
        fontWeight={700} sx={{ mb: 1 }}>
        {t.rich('resultsFor', {
          query: q,
          b: (chunks) => <strong>{chunks}</strong>,
        })}
      </Typography>
      <Typography variant="body2"
        sx={{ opacity: 0.7, mb: 3 }}>
        {t('resultCount', { count: total })}
      </Typography>
      <SearchTabs active={tab} onChange={setTab} />
      {!isFetching && hits.length === 0 && (
        <Box sx={{ py: 6, textAlign: 'center' }}
          data-testid="search-no-results">
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t('noResults')}
          </Typography>
          <Button component={Link} href="/"
            variant="text">
            {t('backHome')}
          </Button>
        </Box>
      )}
      {hits.length > 0 && (
        <SearchResultsList hits={hits} />
      )}
      {lastPage > 1 && (
        <Box sx={{ mt: 3, display: 'flex', gap: 2,
          justifyContent: 'center' }}>
          <Button onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            data-testid="search-prev">
            {t('prev')}
          </Button>
          <Typography sx={{ alignSelf: 'center' }}>
            {page} / {lastPage}
          </Typography>
          <Button onClick={() => setPage(page + 1)}
            disabled={page >= lastPage}
            data-testid="search-next">
            {t('next')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SearchResultsView;
