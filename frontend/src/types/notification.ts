/**
 * Notification type definitions.
 * @module types/notification
 */

/** Notification category. */
export type NotificationType =
  | 'achievement'
  | 'system'
  | 'social'
  | 'chat'
  | 'streak';

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
