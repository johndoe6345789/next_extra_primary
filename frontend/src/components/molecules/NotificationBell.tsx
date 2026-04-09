'use client';

import React from 'react';
import NotificationsIcon from
  '@shared/icons/Notifications';
import { IconButton } from '../atoms';
import { t as tk } from '@shared/theme/tokens';
import { useNotifications } from '@/hooks';
import NotificationBadge from
  './NotificationBadge';

/** Props for the NotificationBell component. */
export interface NotificationBellProps {
  /** Click handler. */
  onClick?: () => void;
  /** data-testid attribute for testing. */
  testId?: string;
}

/**
 * Bell icon with unread count badge overlay.
 *
 * @param props - Component props.
 */
export const NotificationBell: React.FC<
  NotificationBellProps
> = ({ onClick, testId = 'notification-bell' }) => {
  const { unreadCount } = useNotifications();

  const label =
    unreadCount > 0
      ? `${unreadCount} unread notifications`
      : 'No unread notifications';

  const button = (
    <IconButton
      icon={
        <NotificationsIcon
          size={28} strokeWidth={16}
          style={{ color: tk.onSurface }}
        />
      }
      ariaLabel={label}
      onClick={onClick}
      tooltip="Notifications (⌘⇧N)"
      testId={`${testId}-button`}
    />
  );

  if (unreadCount === 0) {
    return (
      <span data-testid={testId}>
        {button}
      </span>
    );
  }

  return (
    <span
      data-testid={testId}
      style={{
        position: 'relative',
        display: 'inline-flex',
      }}
    >
      {button}
      <NotificationBadge
        count={unreadCount}
        testId={testId}
      />
    </span>
  );
};

export default NotificationBell;
