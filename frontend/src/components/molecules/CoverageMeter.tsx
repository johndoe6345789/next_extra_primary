'use client';

import { type ReactElement } from 'react';
import { Box, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useGetCoverageQuery } from
  '@/store/api/translationApi';
import CoverageBar from './CoverageBar';

/**
 * Visual coverage meter showing translation
 * completeness per locale.
 *
 * @returns Coverage meter component.
 */
export default function CoverageMeter(
): ReactElement {
  const t = useTranslations('common');
  const { data, isLoading } = useGetCoverageQuery();

  if (isLoading || !data) {
    return (
      <Typography variant="body2">
        {t('loading')}
      </Typography>
    );
  }

  return (
    <Box
      data-testid="coverage-meter"
      style={{ marginBottom: 24 }}
    >
      <Typography
        variant="subtitle2"
        style={{
          fontWeight: 600, marginBottom: 8,
        }}
      >
        Translation Coverage
        (ref: {data.reference})
      </Typography>
      {data.locales.map((lc) => (
        <CoverageBar
          key={lc.locale}
          locale={lc.locale}
          present={lc.present}
          total={lc.total}
        />
      ))}
    </Box>
  );
}
