/**
 * useUINotifications Hook
 * Manages notification dispatch/removal
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type {
  RootState,
  NotificationType,
  UseUINotificationsReturn,
} from './uiNotificationsTypes';
import {
  useNotifyShortcuts,
} from './uiNotificationHelpers';

export type {
  Notification,
  UseUINotificationsReturn,
} from './uiNotificationsTypes';

/** Hook for UI notifications */
export function useUINotifications(
): UseUINotificationsReturn {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (s: RootState) => s.ui.notifications
  );

  const notify = useCallback(
    (
      message: string,
      type: NotificationType = 'info',
      duration = 5000
    ) => {
      const id =
        `notification-${Date.now()}-` +
        `${Math.random()}`;
      dispatch({
        type: 'ui/setNotification',
        payload: { id, type, message, duration },
      });
      if (duration > 0) {
        setTimeout(() => {
          dispatch({
            type: 'ui/removeNotification',
            payload: id,
          });
        }, duration);
      }
    },
    [dispatch]
  );

  const shortcuts = useNotifyShortcuts(notify);

  const removeNotification = useCallback(
    (id: string) =>
      dispatch({
        type: 'ui/removeNotification',
        payload: id,
      }),
    [dispatch]
  );

  const clearNotifications = useCallback(
    () =>
      dispatch({
        type: 'ui/clearNotifications',
      }),
    [dispatch]
  );

  return {
    notifications,
    notify,
    ...shortcuts,
    removeNotification,
    clearNotifications,
  };
}

export default useUINotifications;
