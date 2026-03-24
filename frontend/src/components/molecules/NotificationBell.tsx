'use client';

import React from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { IconButton } from '../atoms';
import { Badge } from '../atoms';
import { useNotifications } from '@/hooks';

/**
 * Props for the NotificationBell component.
 */
export interface NotificationBellProps {
  /** Callback fired when the bell is clicked. */
  onClick?: () => void;
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * An icon button with a badge overlay showing the
 * unread notification count. Clicking toggles the
 * notification panel. The aria-label dynamically
 * reflects how many unread notifications exist.
 *
 * @param props - Component props.
 * @returns The notification bell element.
 */
export const NotificationBell: React.FC<NotificationBellProps> = ({
  onClick,
  testId = 'notification-bell',
}) => {
  const { unreadCount } = useNotifications();

  const label =
    unreadCount > 0
      ? `${unreadCount} unread notifications`
      : 'No unread notifications';

  return (
    <div data-testid={testId}>
      <Badge
        content={unreadCount}
        color="error"
        invisible={unreadCount === 0}
        testId={`${testId}-badge`}
      >
        <IconButton
          icon={<NotificationsIcon />}
          ariaLabel={label}
          onClick={onClick}
          testId={`${testId}-button`}
        />
      </Badge>
    </div>
  );
};

export default NotificationBell;
