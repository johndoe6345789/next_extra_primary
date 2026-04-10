'use client';

import React from 'react';
import Box from '@shared/m3/Box';
import Typography from '@shared/m3/Typography';
import { useTranslations } from 'next-intl';
import type { UserStats } from '@/types/user';

/** Props for UserQuickStats. */
export interface UserQuickStatsProps {
  /** User stats from the API. */
  stats: UserStats | undefined;
}

/** Single stat item in the row. */
const Stat: React.FC<{
  label: string; testId: string;
}> = ({ label, testId }) => (
  <Typography
    variant="caption"
    data-testid={testId}
    style={{
      color: 'var(--mat-sys-on-surface-variant)',
      textAlign: 'center',
    }}
  >
    {label}
  </Typography>
);

/**
 * Compact horizontal stat row showing level,
 * points, streak days, and badge count.
 */
export const UserQuickStats: React.FC<
  UserQuickStatsProps
> = ({ stats }) => {
  const t = useTranslations('nav');
  if (!stats) return null;
  return (
    <Box
      data-testid="user-quick-stats"
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '8px 16px',
        gap: '8px',
      }}
    >
      <Stat
        label={t('level', { level: stats.level })}
        testId="stat-level"
      />
      <Stat
        label={t('points', {
          pts: stats.totalPoints,
        })}
        testId="stat-points"
      />
      <Stat
        label={t('streak', {
          days: stats.streakDays,
        })}
        testId="stat-streak"
      />
      <Stat
        label={t('badges', {
          count: stats.badgeCount ?? 0,
        })}
        testId="stat-badges"
      />
    </Box>
  );
};

export default UserQuickStats;
