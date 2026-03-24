/**
 * Notification slice — client-side notification state.
 * @module store/slices/notificationSlice
 */
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type {
  Notification,
  NotificationState,
} from '../../types/notification';

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /** Push a new notification to the top. */
    addNotification(
      state,
      action: PayloadAction<Notification>,
    ) {
      state.items.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    /** Remove a notification by ID. */
    removeNotification(
      state,
      action: PayloadAction<string>,
    ) {
      const idx = state.items.findIndex(
        (n) => n.id === action.payload,
      );
      if (idx !== -1) {
        if (!state.items[idx].read) {
          state.unreadCount = Math.max(
            0,
            state.unreadCount - 1,
          );
        }
        state.items.splice(idx, 1);
      }
    },
    /** Mark a notification as read by ID. */
    markRead(
      state,
      action: PayloadAction<string>,
    ) {
      const item = state.items.find(
        (n) => n.id === action.payload,
      );
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(
          0,
          state.unreadCount - 1,
        );
      }
    },
    /** Overwrite the unread count (from API). */
    setUnreadCount(
      state,
      action: PayloadAction<number>,
    ) {
      state.unreadCount = action.payload;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  markRead,
  setUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;
