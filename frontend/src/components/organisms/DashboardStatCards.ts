/**
 * Stat card configuration for the dashboard.
 * @module components/organisms/DashboardStatCards
 */

/** Stat card definition. */
export interface StatCard {
  labelKey: string;
  value: number | null;
  href: string;
}

/**
 * Build the stat card list from dashboard stats.
 *
 * @param stats - Dashboard stats from the API.
 * @returns Array of stat card definitions.
 */
export function buildStatCards(
  stats: {
    currentStreak?: number;
    totalPoints?: number;
    badgeCount?: number;
    rank?: number;
  } | undefined,
): StatCard[] {
  return [
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
}
