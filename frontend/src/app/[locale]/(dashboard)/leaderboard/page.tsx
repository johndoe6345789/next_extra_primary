import type { ReactElement } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { Box, Typography } from '@shared/m3';
import { LeaderboardTable } from '@/components/organisms/LeaderboardTable';

/** Skip static prerendering for this page. */
export const dynamic = 'force-dynamic';
/** Props for the leaderboard page. */
interface LeaderboardPageProps {
  /** Route params containing the locale. */
  readonly params: Promise<{ locale: string }>;
}

/**
 * Leaderboard page displaying user rankings.
 *
 * Renders the `LeaderboardTable` organism with
 * sortable columns for points, streaks, and rank.
 *
 * @param props - Page props with locale params.
 * @returns Leaderboard page UI.
 */
export default async function LeaderboardPage({
  params,
}: LeaderboardPageProps): Promise<ReactElement> {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Box aria-label="Leaderboard">
      <Typography variant="h4" component="h1" gutterBottom>
        Leaderboard
      </Typography>
      <LeaderboardTable />
    </Box>
  );
}
