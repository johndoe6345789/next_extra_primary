'use client';

import React from 'react';
import StarIcon from '@shared/icons/Star';
import Chip from '@shared/m3/Chip';

/**
 * Formats a point value with locale-aware thousand
 * separators for display.
 *
 * @param points - Raw point count.
 * @returns Formatted string (e.g. "1,234").
 */
function formatPoints(points: number): string {
  return points.toLocaleString();
}

/**
 * Props for the PointsDisplay component.
 */
export interface PointsDisplayProps {
  /** The number of points to display. */
  points: number;
  /** Animate with a pulse when value changes. */
  animate?: boolean;
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * Shows the user's point total as a Chip with a
 * star icon. When animate is true, a CSS pulse
 * keyframe is applied to draw attention to value
 * changes.
 *
 * @param props - Component props.
 * @returns The points display element.
 */
export const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  animate = false,
  testId = 'points-display',
}) => {
  const label = `${formatPoints(points)} pts`;

  return (
    <span
      data-testid={testId}
      aria-label={`${points} points`}
      role="status"
      style={{
        display: 'inline-flex',
        animation: animate ? 'pulse 0.4s ease-in-out' : undefined,
      }}
    >
      <Chip
        label={label}
        color="primary"
        icon={<StarIcon size={18} />}
        aria-label={label}
        data-testid={`${testId}-chip`}
      />
    </span>
  );
};

export default PointsDisplay;
