/**
 * UI Notification Types
 * Types for the useUINotifications hook
 */

import type { Notification } from '@shared/redux-slices/uiSlice'

/** @brief Return type for notifications */
export interface UseUINotificationsReturn {
  notifications: Notification[]
  notify: (
    message: string,
    type?:
      | 'success'
      | 'error'
      | 'warning'
      | 'info',
    duration?: number
  ) => void
  success: (
    message: string,
    duration?: number
  ) => void
  error: (
    message: string,
    duration?: number
  ) => void
  warning: (
    message: string,
    duration?: number
  ) => void
  info: (
    message: string,
    duration?: number
  ) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}
