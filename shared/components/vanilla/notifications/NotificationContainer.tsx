import React, { useCallback } from 'react'
import type { NotificationContainerProps } from './types'
import { positionStyles } from './notificationStyles'
import { NotificationItem } from './NotificationItem'

/**
 * Container that renders all active notifications.
 */
export const NotificationContainer: React.FC<
  NotificationContainerProps
> = ({
  notifications,
  onClose,
  position = 'top-right',
  maxVisible = 5,
  className,
}) => {
  const handleClose = useCallback(
    (id: string) => onClose(id),
    [onClose],
  )

  const visible = notifications.slice(0, maxVisible)
  if (visible.length === 0) return null

  return (
    <div
      role="region"
      aria-live="polite"
      aria-atomic="false"
      aria-label="Notifications"
      data-testid="notification-container"
      className={className}
      style={{
        position: 'fixed',
        zIndex: 9999,
        display: 'flex',
        flexDirection:
          position.startsWith('bottom')
            ? 'column-reverse' : 'column',
        gap: '8px',
        pointerEvents: 'none',
        ...positionStyles[position],
      }}
    >
      {visible.map((n) => (
        <div
          key={n.id}
          style={{ pointerEvents: 'auto' }}
        >
          <NotificationItem
            notification={n}
            onClose={() => handleClose(n.id)}
          />
        </div>
      ))}
    </div>
  )
}
