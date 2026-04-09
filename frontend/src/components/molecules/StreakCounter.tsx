'use client';

import React from 'react';
import Chip from '@shared/m3/Chip';

/**
 * Props for the StreakCounter component.
 */
export interface StreakCounterProps {
  /** Number of consecutive days in the streak. */
  days: number;
  /** Whether the streak is currently active. */
  isActive: boolean;
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * Returns the Chip color based on streak length.
 * Green for under 7 days, orange for under 30,
 * and red for 30 or more days.
 */
function getColor(days: number): 'success' | 'warning' | 'error' {
  if (days < 7) return 'success';
  if (days < 30) return 'warning';
  return 'error';
}

/**
 * Displays the user's current streak as a Chip
 * with a fire emoji and the day count. The chip
 * color intensifies with longer streaks. Inactive
 * streaks render in outlined style.
 *
 * @param props - Component props.
 * @returns The streak counter element.
 */
export const StreakCounter: React.FC<StreakCounterProps> = ({
  days,
  isActive,
  testId = 'streak-counter',
}) => {
  const label = `\uD83D\uDD25 ${days} day${days !== 1 ? 's' : ''}`;

  return (
    <span
      data-testid={testId}
      aria-label={`Current streak: ${days} days`}
      role="status"
    >
      <Chip
        label={label}
        color={getColor(days)}
        variant={isActive ? 'filled' : 'outlined'}
        size="medium"
        aria-label={label}
        data-testid={`${testId}-chip`}
      />
    </span>
  );
};

export default StreakCounter;
