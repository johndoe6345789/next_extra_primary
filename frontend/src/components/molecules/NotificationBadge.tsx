'use client';

import React from 'react';
import { t } from '@shared/theme/tokens';

/** Props for NotificationBadge. */
export interface NotificationBadgeProps {
  /** Number of unread notifications. */
  count: number;
  /** data-testid prefix. */
  testId: string;
}

/** Badge style positioned absolutely. */
const badgeStyle: React.CSSProperties = {
  position: 'absolute',
  top: 4,
  right: 4,
  minWidth: 14,
  height: 14,
  borderRadius: 7,
  background: t.error,
  color: t.onError,
  fontSize: 9,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4px',
  pointerEvents: 'none',
  lineHeight: 1,
};

/**
 * Numeric badge overlay indicating unread
 * notification count. Shows "99+" for counts
 * over 99.
 */
const NotificationBadge: React.FC<
  NotificationBadgeProps
> = ({ count, testId }) => (
  <span
    data-testid={`${testId}-badge`}
    style={badgeStyle}
  >
    {count > 99 ? '99+' : count}
  </span>
);

export default NotificationBadge;
