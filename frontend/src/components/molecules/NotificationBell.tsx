'use client';

import React from 'react';
import NotificationsIcon from '@shared/icons/Notifications';
import { IconButton } from '../atoms';
import { Badge } from '../atoms';
import { useNotifications } from '@/hooks';

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
          size={28}
          strokeWidth={16}
          style={{ color: '#fff' }}
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
      <span
        data-testid={`${testId}-badge`}
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          minWidth: 14,
          height: 14,
          borderRadius: 7,
          background: 'var(--mat-sys-error, #b3261e)',
          color: 'var(--mat-sys-on-error, #fff)',
          fontSize: 9,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 4px',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </span>
  );
};

export default NotificationBell;
