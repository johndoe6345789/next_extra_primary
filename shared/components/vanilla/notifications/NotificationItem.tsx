import React, { useEffect } from 'react'
import type { NotificationItemProps } from './types'
import { typeStyles } from './notificationStyles'
import { typeIcons, CloseIcon } from './icons'

/**
 * Individual notification item with auto-dismiss.
 */
export const NotificationItem: React.FC<
  NotificationItemProps
> = ({ notification, onClose }) => {
  const { type, message, title, duration } = notification
  const styles = typeStyles[type]
  const Icon = typeIcons[type]

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div
      role="alert"
      data-testid={`notification-${notification.id}`}
      data-notification-type={type}
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: styles.bg,
        borderLeft: `4px solid ${styles.border}`,
        color: styles.text,
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        minWidth: '280px',
        maxWidth: '400px',
        animation:
          'notification-slide-in 0.3s ease-out',
      }}
    >
      <div style={{ flexShrink: 0, marginTop: 2 }}>
        <Icon />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <p style={{
            fontWeight: 600,
            marginBottom: 4,
            fontSize: '14px',
          }}>
            {title}
          </p>
        )}
        <p style={{ fontSize: '14px', lineHeight: 1.5 }}>
          {message}
        </p>
      </div>
      <button
        onClick={onClose}
        aria-label="Close notification"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: 'inherit',
          opacity: 0.7,
          flexShrink: 0,
        }}
      >
        <CloseIcon />
      </button>
    </div>
  )
}
