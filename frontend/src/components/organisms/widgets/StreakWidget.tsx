'use client';

import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import Skeleton from '@shared/m3/Skeleton';
import { useTranslations } from 'next-intl';
import { useGamification } from '@/hooks';
import { StreakCounter } from
  '@/components/molecules';

/**
 * Dashboard widget showing the user's current and
 * longest streak with a visual indicator.
 */
export default function StreakWidget() {
  const t = useTranslations('dashboard');
  const { streak, isLoading } = useGamification();

  if (isLoading) {
    return (
      <Box data-testid="streak-widget-loading">
        <Skeleton width={120} height={40} />
        <Skeleton width={80} height={20} />
      </Box>
    );
  }

  const current = streak?.current ?? 0;
  const longest = streak?.longest ?? 0;
  const active = streak?.isActiveToday ?? false;

  return (
    <Box data-testid="streak-widget">
      <StreakCounter
        days={current}
        isActive={active}
      />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        {t('longestStreak', { days: longest })}
      </Typography>
    </Box>
  );
}
