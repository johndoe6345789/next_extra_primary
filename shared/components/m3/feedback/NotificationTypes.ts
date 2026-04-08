/**
 * Type definitions for Notification components.
 */

/** Notification severity type */
export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'

/** Screen position */
export type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

/** A single notification entry */
export interface NotificationData {
  id: string
  type: NotificationType
  message: string
  duration?: number
}

/** Props for the NotificationContainer */
export interface NotificationContainerProps {
  notifications: NotificationData[]
  onClose: (id: string) => void
  position?: NotificationPosition
  maxVisible?: number
  className?: string
  testId?: string
}
