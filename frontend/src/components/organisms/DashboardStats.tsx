'use client';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useDashboard } from '@/hooks';

/** Stat card definition. */
interface StatCard {
  labelKey: string;
  value: number | null;
  href: string;
}

/**
 * Dashboard stats grid with live data from API.
 * Falls back to loading skeletons, then real values.
 */
export default function DashboardStats() {
  const t = useTranslations('dashboard');
  const { stats, isLoading } = useDashboard();

  const cards: StatCard[] = [
    {
      labelKey: 'currentStreak',
      value: stats?.currentStreak ?? null,
      href: '/profile',
    },
    {
      labelKey: 'totalPoints',
      value: stats?.totalPoints ?? null,
      href: '/leaderboard',
    },
    {
      labelKey: 'badgesEarned',
      value: stats?.badgeCount ?? null,
      href: '/profile',
    },
    {
      labelKey: 'rank',
      value: stats?.rank ?? null,
      href: '/leaderboard',
    },
  ];

  return (
    <Grid
      container
      spacing={3}
      role="list"
      aria-label={t('title')}
      data-testid="dashboard-stats"
    >
      {cards.map((card) => (
        <Grid
          key={card.labelKey}
          size={{ xs: 12, sm: 6, md: 3 }}
        >
          <Card role="listitem" elevation={2}>
            <CardActionArea
              component={Link}
              href={card.href}
            >
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                >
                  {t(card.labelKey)}
                </Typography>
                {isLoading ? (
                  <Skeleton
                    variant="text"
                    width={60}
                    height={40}
                  />
                ) : (
                  <Typography
                    variant="h4"
                    component="p"
                  >
                    {card.value ?? t('noData')}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
