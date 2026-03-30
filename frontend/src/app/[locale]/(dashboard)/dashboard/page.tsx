import type { ReactElement } from 'react';
import {
  setRequestLocale,
  getTranslations,
} from 'next-intl/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
/** Props for the dashboard home page. */
interface DashboardPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Dashboard home page.
 *
 * Shows user stats, recent badges, streak info,
 * and quick-action cards in a responsive grid.
 *
 * @param props - Page props with locale params.
 * @returns Dashboard overview UI.
 */
export default async function DashboardPage({
  params,
}: DashboardPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('dashboard');

  const cards = [
    { key: 'currentStreak', title: t('currentStreak') },
    { key: 'totalPoints', title: t('totalPoints') },
    { key: 'badgesEarned', title: t('badgesEarned') },
    { key: 'rank', title: t('rank') },
  ];

  return (
    <Box aria-label={t('title')}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title')}
      </Typography>
      <Grid
        container
        spacing={3}
        role="list"
        aria-label={t('title')}
      >
        {cards.map((card) => (
          <Grid
            key={card.key}
            size={{ xs: 12, sm: 6, md: 3 }}
          >
            <Card role="listitem" elevation={2}>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                >
                  {card.title}
                </Typography>
                <Typography variant="h4" component="p">
                  {t('noData')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
