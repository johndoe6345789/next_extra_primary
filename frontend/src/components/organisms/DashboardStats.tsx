'use client';

import Grid from '@shared/m3/Grid';
import Card from '@shared/m3/Card';
import CardActionArea from '@shared/m3/CardActionArea';
import CardContent from '@shared/m3/CardContent';
import Typography from '@shared/m3/Typography';
import Skeleton from '@shared/m3/Skeleton';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useDashboard } from '@/hooks';
import { buildStatCards } from
  './DashboardStatCards';

/**
 * Dashboard stats grid with live data from API.
 * Falls back to loading skeletons, then real values.
 */
export default function DashboardStats() {
  const t = useTranslations('dashboard');
  const { stats, isLoading } = useDashboard();
  const cards = buildStatCards(stats ?? undefined);

  return (
    <Grid
      container spacing={3} role="list"
      aria-label={t('title')}
      data-testid="dashboard-stats"
    >
      {cards.map((card) => (
        <Grid
          key={card.labelKey}
          item xs={12} sm={6} md={3}
        >
          <Card role="listitem">
            <Link
              href={card.href}
              style={{
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
            <CardActionArea>
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
                    width={60} height={40}
                  />
                ) : (
                  <Typography variant="h4">
                    {card.value ?? t('noData')}
                  </Typography>
                )}
              </CardContent>
            </CardActionArea>
            </Link>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
