'use client';

/**
 * Aggregates notification data and mutations.
 * Polls every 30 s, pauses when tab is hidden.
 * @module hooks/useNotifications
 */
import { useEffect, useRef } from 'react';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '@/store/api/notificationApi';
import type { Notification }
  from '@/types/notification';
import cfg from '@/constants/notifications.json';

/** Return type for useNotifications. */
interface UseNotificationsReturn {
  /** Notification list for the current page. */
  notifications: Notification[];
  /** Count of unread notifications. */
  unreadCount: number;
  /** Mark one notification as read. */
  markAsRead: (id: string) => void;
  /** Mark every notification as read. */
  markAllAsRead: () => void;
  /** Whether the initial list is loading. */
  isLoading: boolean;
}

/**
 * Provides notification state and actions with
 * visibility-aware polling.
 *
 * @returns Notification state and action helpers.
 */
export function useNotifications(
): UseNotificationsReturn {
  const skip = useRef(false);

  const { data, isLoading, refetch: refetchList } =
    useGetNotificationsQuery({ page: 1 });

  const {
    data: countData,
    refetch: refetchCount,
  } = useGetUnreadCountQuery();

  const [markRead] = useMarkAsReadMutation();
  const [markAll] = useMarkAllAsReadMutation();

  useEffect(() => {
    const poll = setInterval(() => {
      if (!skip.current) {
        refetchList();
        refetchCount();
      }
    }, cfg.POLL_INTERVAL_MS);

    const onVisible = () => {
      skip.current =
        document.visibilityState === 'hidden';
    };

    document.addEventListener(
      'visibilitychange', onVisible,
    );
    onVisible();

    return () => {
      clearInterval(poll);
      document.removeEventListener(
        'visibilitychange', onVisible,
      );
    };
  }, [refetchList, refetchCount]);

  return {
    notifications: data?.data ?? [],
    unreadCount:
      countData?.unread_count ?? 0,
    markAsRead: (id) => { markRead(id); },
    markAllAsRead: () => { markAll(); },
    isLoading,
  };
}

export default useNotifications;
