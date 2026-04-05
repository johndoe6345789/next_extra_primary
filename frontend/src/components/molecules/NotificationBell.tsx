'use client';

import React from 'react';
import NotificationsIcon from '@shared/icons/Notifications';
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
      {unreadCount > 0 ? (
        <Badge
          content={unreadCount}
          color="error"
          testId={`${testId}-badge`}
        >
          <IconButton
            icon={<NotificationsIcon />}
            ariaLabel={label}
            onClick={onClick}
            tooltip="Notifications (⌘⇧N)"
            testId={`${testId}-button`}
          />
        </Badge>
      ) : (
        <IconButton
          icon={<NotificationsIcon />}
          ariaLabel={label}
          onClick={onClick}
          tooltip="Notifications (⌘⇧N)"
          testId={`${testId}-button`}
        />
      )}
    </div>
  );
};

export default NotificationBell;
