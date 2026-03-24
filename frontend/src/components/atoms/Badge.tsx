'use client';

import React from 'react';
import MuiBadge from '@mui/material/Badge';

/**
 * Props for the Badge component.
 */
export interface BadgeProps {
  /** Badge content (number or string) */
  content?: number | string;
  /** MUI badge color */
  color?:
    | 'primary'
    | 'secondary'
    | 'error'
    | 'warning'
    | 'info'
    | 'success'
    | 'default';
  /** Display variant */
  variant?: 'dot' | 'standard';
  /** Whether the badge is hidden */
  invisible?: boolean;
  /** Max count before showing "N+" */
  max?: number;
  /** Element the badge is attached to */
  children: React.ReactNode;
  /** data-testid attribute for testing */
  testId?: string;
}

/**
 * A badge indicator component wrapping MUI Badge.
 * Displays a count or dot on top of its child element.
 */
export const Badge: React.FC<BadgeProps> = ({
  content,
  color = 'primary',
  variant = 'standard',
  invisible = false,
  max = 99,
  children,
  testId = 'badge',
}) => {
  return (
    <MuiBadge
      badgeContent={content}
      color={color}
      variant={variant}
      invisible={invisible}
      max={max}
      data-testid={testId}
    >
      {children}
    </MuiBadge>
  );
};

export default Badge;
