'use client';

import React from 'react';
import NotificationsIcon from
  '@shared/icons/Notifications';
import { IconButton } from '../atoms';
import { t as tk } from '@shared/theme/tokens';
import { useNotifications } from '@/hooks';
import { useMentions } from '@/hooks/useMentions';
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
 * Bell icon showing combined unread count from
 * notifications and @mentions.
 *
 * @param props - Component props.
 */
export const NotificationBell: React.FC<
  NotificationBellProps
> = ({ onClick, testId = 'notification-bell' }) => {
  const { unreadCount: notifCount } = useNotifications();
  const { unreadCount: mentionCount } = useMentions();
  const unreadCount = notifCount + mentionCount;

  const label =
    unreadCount > 0
      ? `${unreadCount} unread notifications`
      : 'No unread notifications';

  const button = (
    <IconButton
      icon={
        <NotificationsIcon
          size={28}
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
      <span data-testid={testId}>{button}</span>
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
