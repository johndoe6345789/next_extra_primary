'use client'

/**
 * NotificationItem - a single dismissible
 * notification entry.
 */

import React, { useEffect } from 'react'
import { classNames } from '../utils/classNames'
import type {
  NotificationData,
  NotificationType,
} from './NotificationTypes'

const ICONS: Record<NotificationType, string> = {
  success: '\u2713',
  error: '\u2715',
  warning: '\u26A0',
  info: '\u2139',
}

/** Props for a single notification */
interface NotificationItemProps {
  notification: NotificationData
  onClose: (id: string) => void
}

/** Renders one notification with auto-dismiss. */
export const NotificationItem: React.FC<
  NotificationItemProps
> = ({ notification, onClose }) => {
  const { id, type, message, duration = 5000 } =
    notification

  useEffect(() => {
    if (duration > 0) {
      const t = setTimeout(() => onClose(id), duration)
      return () => clearTimeout(t)
    }
  }, [id, duration, onClose])

  const cls = classNames(
    'm3-notification',
    `m3-notification--${type}`,
  )

  return (
    <div className={cls} role="alert" aria-live="polite">
      <span className="m3-notification__icon">
        {ICONS[type]}
      </span>
      <span className="m3-notification__message">
        {message}
      </span>
      <button
        className="m3-notification__close"
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  )
}
