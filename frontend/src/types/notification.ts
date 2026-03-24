/**
 * Notification type definitions.
 * @module types/notification
 */

/** Notification category. */
export type NotificationType =
  | 'badge_earned'
  | 'level_up'
  | 'streak_milestone'
  | 'system'
  | 'social'
  | 'chat';

/** A single notification record. */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

/** Redux state shape for notifications. */
export interface NotificationState {
  items: Notification[];
  unreadCount: number;
  isLoading: boolean;
}
