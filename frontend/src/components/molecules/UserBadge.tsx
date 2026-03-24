'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiTooltip from '@mui/material/Tooltip';
import type { Badge } from '@/types/gamification';

/** Size presets in pixels. */
const SIZES = { sm: 48, lg: 80 } as const;

/**
 * Props for the UserBadge component.
 */
export interface UserBadgeProps {
  /** The badge data to display. */
  badge: Badge;
  /** Whether this badge has been earned. */
  earned: boolean;
  /** Display size preset. */
  size?: 'sm' | 'lg';
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * Displays a gamification badge as a small card with
 * an icon, name, and earned date. Unearned badges
 * render with a grayscale filter. A tooltip shows
 * the badge description on hover.
 *
 * @param props - Component props.
 * @returns The user badge element.
 */
export const UserBadge: React.FC<UserBadgeProps> = ({
  badge,
  earned,
  size = 'sm',
  testId = 'user-badge',
}) => {
  const px = SIZES[size];

  return (
    <MuiTooltip title={badge.description} arrow>
      <Box
        data-testid={testId}
        role="img"
        aria-label={
          earned
            ? `Badge: ${badge.name} - earned`
            : `Badge: ${badge.name} - not earned`
        }
        sx={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
          filter: earned ? 'none' : 'grayscale(100%)',
          opacity: earned ? 1 : 0.5,
        }}
      >
        <Box
          component="img"
          src={badge.iconUrl}
          alt={badge.name}
          sx={{ width: px, height: px }}
        />
        <Typography variant="caption" noWrap sx={{ maxWidth: px + 16 }}>
          {badge.name}
        </Typography>
        {earned && badge.earnedAt && (
          <Typography variant="caption" color="text.secondary">
            {new Date(badge.earnedAt).toLocaleDateString()}
          </Typography>
        )}
      </Box>
    </MuiTooltip>
  );
};

export default UserBadge;
