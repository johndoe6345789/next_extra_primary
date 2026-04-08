/**
 * useUINotifications Hook
 * Manages notifications (success, error,
 * warning, info) with auto-dismiss.
 */

import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@shared/redux-slices'
import {
  setNotification,
  removeNotification,
  clearNotifications,
} from '@shared/redux-slices/uiSlice'
import type { UseUINotificationsReturn } from './notificationTypes'

export type { UseUINotificationsReturn } from './notificationTypes'

/** @brief Notification management hook */
export function useUINotifications(): UseUINotificationsReturn {
  const dispatch = useDispatch()
  const notifications = useSelector(
    (s: RootState) => s.ui.notifications
  )

  const notify = useCallback(
    (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 5000) => {
      const id = `notification-${Date.now()}-${Math.random()}`
      dispatch(setNotification({ id, type, message: msg, duration }))
      if (duration > 0) {
        setTimeout(() => dispatch(removeNotification(id)), duration)
      }
    }, [dispatch]
  )

  const success = useCallback((msg: string, d?: number) => notify(msg, 'success', d), [notify])
  const error = useCallback((msg: string, d?: number) => notify(msg, 'error', d), [notify])
  const warning = useCallback((msg: string, d?: number) => notify(msg, 'warning', d), [notify])
  const info = useCallback((msg: string, d?: number) => notify(msg, 'info', d), [notify])

  const removeNotify = useCallback((id: string) => {
    dispatch(removeNotification(id))
  }, [dispatch])

  const clearAll = useCallback(() => {
    dispatch(clearNotifications())
  }, [dispatch])

  return {
    notifications, notify, success, error,
    warning, info,
    removeNotification: removeNotify,
    clearNotifications: clearAll,
  }
}

export default useUINotifications
