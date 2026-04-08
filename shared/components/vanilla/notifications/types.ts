import type React from 'react'

/** Notification severity type. */
export type NotificationType =
  | 'success' | 'error' | 'warning' | 'info'

/** Screen position for notifications. */
export type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

/** Single notification data. */
export interface NotificationData {
  id: string
  type: NotificationType
  message: string
  title?: string
  /** Duration in ms; 0 = no auto-dismiss */
  duration?: number
}

/** Props for NotificationContainer. */
export interface NotificationContainerProps {
  /** Array of notifications to display */
  notifications: NotificationData[]
  /** Called when a notification should be removed */
  onClose: (id: string) => void
  /** Position on screen */
  position?: NotificationPosition
  /** Maximum notifications to show at once */
  maxVisible?: number
  /** Custom className for container */
  className?: string
}

/** Props for a single NotificationItem. */
export interface NotificationItemProps {
  notification: NotificationData
  onClose: () => void
}
