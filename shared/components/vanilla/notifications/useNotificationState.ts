import { useState, useCallback } from 'react'
import type { NotificationData } from './types'

/**
 * Hook for managing notification state.
 *
 * @param initial - Initial notifications array.
 * @returns Notification state and actions.
 *
 * @example
 * const { notifications, addNotification, removeNotification } =
 *   useNotificationState()
 * addNotification({ type: 'success', message: 'Done!' })
 */
export function useNotificationState(
  initial: NotificationData[] = [],
) {
  const [notifications, setNotifications] =
    useState<NotificationData[]>(initial)

  const addNotification = useCallback(
    (n: Omit<NotificationData, 'id'>) => {
      const id =
        `notification-${Date.now()}-` +
        `${Math.random().toString(36).slice(2, 9)}`
      setNotifications((prev) => [...prev, { ...n, id }])
      return id
    },
    [],
  )

  const removeNotification = useCallback(
    (id: string) => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== id),
      )
    },
    [],
  )

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  }
}
