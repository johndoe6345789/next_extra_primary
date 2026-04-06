'use client';

import Grid from '@shared/m3/Grid';
import Typography from '@shared/m3/Typography';
import Skeleton from '@shared/m3/Skeleton';
import { useTranslations } from 'next-intl';
import { useDashboard } from '@/hooks';

/** Single stat row definition. */
interface Stat {
  labelKey: string;
  value: number | null;
}

/**
 * Compact stats grid showing key dashboard numbers.
 * Fetches data via useDashboard hook.
 */
export default function StatsWidget() {
  const t = useTranslations('dashboard');
  const { stats, isLoading } = useDashboard();

  const items: Stat[] = [
    { labelKey: 'currentStreak', value: stats?.currentStreak ?? null },
    { labelKey: 'totalPoints', value: stats?.totalPoints ?? null },
    { labelKey: 'badgesEarned', value: stats?.badgeCount ?? null },
    { labelKey: 'rank', value: stats?.rank ?? null },
  ];

  return (
    <Grid
      container spacing={2}
      data-testid="stats-widget"
    >
      {items.map((s) => (
        <Grid key={s.labelKey} item xs={6} sm={3}>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {t(s.labelKey)}
          </Typography>
          {isLoading ? (
            <Skeleton width={50} height={32} />
          ) : (
            <Typography variant="h5">
              {s.value ?? t('noData')}
            </Typography>
          )}
        </Grid>
      ))}
    </Grid>
  );
}
