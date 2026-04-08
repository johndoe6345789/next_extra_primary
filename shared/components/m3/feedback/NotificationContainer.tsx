'use client'

/**
 * NotificationContainer - positioned stack of
 * auto-dismissing notification items.
 */

import React, { useCallback } from 'react'
import { classNames } from '../utils/classNames'
import type { NotificationContainerProps } from './NotificationTypes'
import { NotificationItem } from './NotificationItem'

export type {
  NotificationType,
  NotificationPosition,
  NotificationData,
  NotificationContainerProps,
} from './NotificationTypes'

/** Renders a stack of notification items. */
export const NotificationContainer: React.FC<
  NotificationContainerProps
> = ({
  notifications,
  onClose,
  position = 'top-right',
  maxVisible = 5,
  className = '',
  testId,
}) => {
  const handleClose = useCallback(
    (id: string) => onClose(id),
    [onClose],
  )

  const visible = notifications.slice(0, maxVisible)
  if (visible.length === 0) return null

  const cls = classNames(
    'm3-notification-container',
    `m3-notification-container--${position}`,
    className,
  )

  return (
    <div
      className={cls}
      data-testid={testId}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {visible.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onClose={handleClose}
        />
      ))}
    </div>
  )
}

export default NotificationContainer
