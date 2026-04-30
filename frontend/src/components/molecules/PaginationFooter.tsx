'use client';

import React from 'react';
import { Box, Typography, Button } from '@shared/m3';
import { Pagination } from '@shared/m3/navigation';
import { useTranslations } from 'next-intl';

/** Props for PaginationFooter. */
export interface PaginationFooterProps {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
  /** i18n namespace supplying `pageOf` and `prev`/`next`
   *  labels for the navigation buttons. */
  ns: string;
  testId?: string;
}

/** Large Prev / Next buttons + page-number strip +
 *  "Page X of Y" indicator, centred.
 *  Returns null when there is only one page. */
export function PaginationFooter({
  page, pageCount, onChange, ns,
  testId = 'pagination-footer',
}: PaginationFooterProps): React.ReactElement | null {
  const t = useTranslations(ns);
  if (pageCount <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < pageCount;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5,
        my: 3,
      }}
      data-testid={testId}
    >
      {/* Primary navigation row — big thumb-friendly buttons */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        <Button
          variant="contained"
          size="large"
          disabled={!hasPrev}
          onClick={() => onChange(page - 1)}
          aria-label={t('prev')}
          data-testid={`${testId}-prev`}
          sx={{ minWidth: 120, py: 1.25 }}
        >
          ← {t('prev')}
        </Button>

        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            minWidth: 96,
            textAlign: 'center',
            color: 'text.primary',
          }}
          data-testid={`${testId}-indicator`}
        >
          {t('pageOf', { page, total: pageCount })}
        </Typography>

        <Button
          variant="contained"
          size="large"
          disabled={!hasNext}
          onClick={() => onChange(page + 1)}
          aria-label={t('next')}
          data-testid={`${testId}-next`}
          sx={{ minWidth: 120, py: 1.25 }}
        >
          {t('next')} →
        </Button>
      </Box>

      {/* Secondary strip — quick jump to any page */}
      {pageCount > 2 && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={onChange}
          size="small"
          aria-label={t('pagination')}
          data-testid={`${testId}-strip`}
        />
      )}
    </Box>
  );
}

export default PaginationFooter;
