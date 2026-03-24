'use client';

import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '@/store/api/notificationApi';

/** Return type for the useNotifications hook. */
interface UseNotificationsReturn {
  /** List of notifications for the current page. */
  notifications: unknown[];
  /** Number of unread notifications. */
  unreadCount: number;
  /** Mark a single notification as read. */
  markAsRead: (id: string) => void;
  /** Mark all notifications as read. */
  markAllAsRead: () => void;
  /** Whether the data is currently loading. */
  isLoading: boolean;
}

/**
 * Aggregates notification data and mutations from
 * RTK Query. Provides the unread count, list, and
 * helpers to mark notifications as read.
 *
 * @returns Notification state and actions.
 */
export function useNotifications(): UseNotificationsReturn {
  const { data, isLoading: listLoading } = useGetNotificationsQuery({
    page: 1,
  });
  const { data: countData } = useGetUnreadCountQuery();

  const [markRead] = useMarkAsReadMutation();
  const [markAll] = useMarkAllAsReadMutation();

  return {
    notifications: data?.data ?? [],
    unreadCount: countData?.count ?? 0,
    markAsRead: (id: string) => {
      markRead(id);
    },
    markAllAsRead: () => {
      markAll();
    },
    isLoading: listLoading,
  };
}

export default useNotifications;
