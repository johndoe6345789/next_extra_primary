'use client';

import React from 'react';
import Box from '@metabuilder/m3/Box';
import Typography from '@metabuilder/m3/Typography';
import Grid from '@metabuilder/m3/Grid';
import { UserBadge } from '../molecules/UserBadge';
import type { Badge } from '@/types/gamification';

/**
 * Props for the BadgeShowcase organism.
 */
export interface BadgeShowcaseProps {
  /** All available badges. */
  badges: Badge[];
  /** IDs of badges the user has earned. */
  earnedBadgeIds: string[];
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * Grid display of user badges. Earned badges
 * render in full color; unearned are grayed out.
 * Shows count of earned versus total.
 *
 * @param props - Component props.
 */
export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({
  badges,
  earnedBadgeIds,
  testId = 'badge-showcase',
}) => {
  const earnedSet = new Set(earnedBadgeIds);
  const earnedCount = earnedSet.size;

  return (
    <Box data-testid={testId} aria-label="Badge collection" role="region">
      <Typography variant="subtitle1" gutterBottom data-testid="badge-count">
        {earnedCount} of {badges.length} earned
      </Typography>
      <Grid container spacing={2} role="list" aria-label="Badges">
        {badges.map((badge) => (
          <Grid key={badge.id} item xs={4} sm={3} md={2} role="listitem">
            <UserBadge
              badge={badge}
              earned={earnedSet.has(badge.id)}
              testId={`badge-${badge.id}`}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BadgeShowcase;
