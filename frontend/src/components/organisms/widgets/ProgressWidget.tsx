'use client';

import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Skeleton from '@shared/m3/Skeleton';
import { useTranslations } from 'next-intl';
import { useGamification } from '@/hooks';
import { ProgressBar } from
  '@/components/atoms';

/**
 * Dashboard widget showing level progress toward
 * the next level, with a progress bar.
 */
export default function ProgressWidget() {
  const t = useTranslations('dashboard');
  const { progress, level, isLoading } =
    useGamification();

  if (isLoading) {
    return (
      <Box data-testid="progress-widget-loading">
        <Skeleton width={100} height={24} />
        <Skeleton
          width="100%" height={8}
        />
      </Box>
    );
  }

  const pct = progress?.percentComplete ?? 0;
  const toNext = progress?.pointsToNext ?? 0;

  return (
    <Box data-testid="progress-widget">
      <Typography variant="h6" gutterBottom>
        {t('levelLabel', { level })}
      </Typography>
      <ProgressBar
        value={pct}
        showPercentage
        label={t('levelProgress')}
        color="secondary"
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 0.5, display: 'block' }}
      >
        {t('pointsToNext', { points: toNext })}
      </Typography>
    </Box>
  );
}
