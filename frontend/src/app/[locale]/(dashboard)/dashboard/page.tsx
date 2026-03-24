import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

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

  const cards = [
    { title: 'Current Streak', value: '--' },
    { title: 'Total Points', value: '--' },
    { title: 'Badges Earned', value: '--' },
    { title: 'Rank', value: '--' },
  ] as const;

  return (
    <Box aria-label="Dashboard overview">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3} role="list" aria-label="User statistics">
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card role="listitem" elevation={2}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h4" component="p">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
