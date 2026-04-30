'use client';

import React from 'react';
import { Box, Typography } from '@shared/m3';
import { Icon } from '@shared/m3/data-display/Icon';

/** Props for LockedBoardCard. */
export interface LockedBoardCardProps {
  /** Board display label. */
  label: string;
  /** One-line board description. */
  description?: string;
  /** Material icon name. */
  icon?: string;
  /** Human-readable lock reason, e.g.
   *  "Sign in to view" or "500 more posts needed". */
  reason: string;
}

/**
 * Greyed-out board card shown when the current user
 * does not meet the board's access requirements
 * (auth or post-count gating).
 */
export function LockedBoardCard({
  label, description, icon = 'lock', reason,
}: LockedBoardCardProps): React.ReactElement {
  return (
    <Box
      aria-label={`${label} — locked`}
      data-testid={`locked-board-${label}`}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderRadius: 2,
        background: 'var(--mat-sys-surface-container)',
        opacity: 0.55,
        mb: 1,
        border: '1px dashed var(--mat-sys-outline)',
      }}
    >
      <Icon size="lg" color="secondary">{icon}</Icon>
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 600,
            color: 'text.secondary' }}
        >
          🔒 {label}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            sx={{ color: 'text.disabled' }}
          >
            {description}
          </Typography>
        )}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: 'text.disabled',
          fontStyle: 'italic',
          whiteSpace: 'nowrap',
        }}
      >
        {reason}
      </Typography>
    </Box>
  );
}

export default LockedBoardCard;
