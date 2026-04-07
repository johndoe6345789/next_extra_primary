'use client';

import React from 'react';
import MuiBadge from '@shared/m3/Badge';
import type {
  BadgeSize,
  OverlapShape,
} from '@shared/m3/Badge';

/** Props for the Badge component. */
export interface BadgeProps {
  /** Badge content (number or string). */
  content?: number | string;
  /** Badge color. */
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'default';
  /** Display variant. */
  variant?: 'dot' | 'standard';
  /** Whether the badge is hidden. */
  invisible?: boolean;
  /** Max count before showing "N+". */
  max?: number;
  /** Badge size. */
  size?: BadgeSize;
  /** Overlap shape. */
  overlap?: OverlapShape;
  /** Element the badge is attached to. */
  children: React.ReactNode;
  /** data-testid for testing. */
  testId?: string;
}

/**
 * Badge indicator wrapping the M3 Badge.
 *
 * @param props - Component props.
 */
export const Badge: React.FC<BadgeProps> = ({
  content,
  color = 'primary',
  variant = 'standard',
  invisible = false,
  max = 99,
  size,
  overlap,
  children,
  testId = 'badge',
}) => (
  <MuiBadge
    content={content}
    color={color}
    variant={variant}
    invisible={invisible}
    max={max}
    size={size}
    overlap={overlap}
    data-testid={testId}
  >
    {children}
  </MuiBadge>
);

export default Badge;
