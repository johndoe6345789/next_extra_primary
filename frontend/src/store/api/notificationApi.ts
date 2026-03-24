/**
 * Notification API endpoints injected into baseApi.
 * @module store/api/notificationApi
 */
import { baseApi } from './baseApi';
import type { Notification } from '../../types/notification';
import type { PaginatedResponse } from '../../types/api';

/** Notification CRUD + unread count endpoints. */
export const notificationApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** Fetch paginated notifications. */
    getNotifications: build.query<
      PaginatedResponse<Notification>,
      { page?: number; perPage?: number }
    >({
      query: ({ page = 1, perPage = 20 }) =>
        `/notifications?page=${page}&perPage=${perPage}`,
      providesTags: ['Notification'],
    }),

    /** Get unread notification count (polls). */
    getUnreadCount: build.query<
      { count: number },
      void
    >({
      query: () => '/notifications/unread-count',
      providesTags: ['Notification'],
      pollingInterval: 30_000,
    }),

    /** Mark a single notification as read. */
    markAsRead: build.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    /** Mark every notification as read. */
    markAllAsRead: build.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),

    /** Delete a notification by ID. */
    deleteNotification: build.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationApi;
