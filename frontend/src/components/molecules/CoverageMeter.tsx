'use client';

import { type ReactElement } from 'react';
import { Box, Typography } from '@shared/m3';
import { useTranslations } from 'next-intl';
import { useGetCoverageQuery } from
  '@/store/api/translationApi';

/** Single locale bar colour based on %. */
function barColor(pct: number): string {
  if (pct >= 100) return 'var(--mat-sys-primary)';
  if (pct >= 80) return '#f59e0b';
  return '#ef4444';
}

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
        style={{ fontWeight: 600, marginBottom: 8 }}
      >
        Translation Coverage (ref: {data.reference})
      </Typography>
      {data.locales.map((lc) => {
        const pct = lc.total > 0
          ? Math.round(
            (lc.present / lc.total) * 100,
          ) : 0;
        return (
          <div
            key={lc.locale}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
            data-testid={`cov-${lc.locale}`}
          >
            <span style={{
              width: 28,
              fontWeight: 600,
              fontSize: 13,
            }}>
              {lc.locale.toUpperCase()}
            </span>
            <div style={{
              flex: 1, height: 14,
              borderRadius: 7,
              background:
                'var(--mat-sys-surface-variant)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${pct}%`,
                height: '100%',
                borderRadius: 7,
                background: barColor(pct),
                transition: 'width 0.3s',
              }} />
            </div>
            <span style={{
              width: 70, fontSize: 12,
              textAlign: 'right',
            }}>
              {lc.present}/{lc.total}
              {' '}({pct}%)
            </span>
          </div>
        );
      })}
    </Box>
  );
}
