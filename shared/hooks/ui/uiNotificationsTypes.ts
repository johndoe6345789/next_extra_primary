/**
 * Types for useUINotifications hook
 */

/** Notification object */
export interface Notification {
  id: string;
  type:
    | 'success'
    | 'error'
    | 'warning'
    | 'info';
  message: string;
  duration?: number;
}

/** UI state with notifications */
export interface UIState {
  notifications: Notification[];
}

/** Root state shape */
export interface RootState {
  ui: UIState;
}

/** Notification type */
export type NotificationType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

/** Return type of useUINotifications */
export interface UseUINotificationsReturn {
  notifications: Notification[];
  notify: (
    message: string,
    type?: NotificationType,
    duration?: number
  ) => void;
  success: (
    message: string,
    duration?: number
  ) => void;
  error: (
    message: string,
    duration?: number
  ) => void;
  warning: (
    message: string,
    duration?: number
  ) => void;
  info: (
    message: string,
    duration?: number
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}
