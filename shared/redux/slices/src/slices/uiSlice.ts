/**
 * UI Redux Slice
 * Manages modals, notifications, theme, sidebar
 */

import { createSlice, PayloadAction } from
  '@reduxjs/toolkit';
import { uiInitialState } from './uiTypes';
import type { UIState, Notification } from
  './uiTypes';
import {
  setThemeReducer, toggleThemeReducer,
  setSidebarOpenReducer, toggleSidebarReducer,
} from './uiPersistReducers';

export type { UIState, Notification };

export const uiSlice = createSlice({
  name: 'ui',
  initialState: uiInitialState,
  reducers: {
    openModal: (state, action: PayloadAction<
      keyof UIState['modals']
    >) => { state.modals[action.payload] = true; },
    closeModal: (state, action: PayloadAction<
      keyof UIState['modals']
    >) => {
      state.modals[action.payload] = false;
    },
    toggleModal: (state, action: PayloadAction<
      keyof UIState['modals']
    >) => {
      state.modals[action.payload] =
        !state.modals[action.payload];
    },
    setNotification: (
      state, action: PayloadAction<Notification>
    ) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (
      state, action: PayloadAction<string>
    ) => {
      state.notifications =
        state.notifications.filter(
          (n) => n.id !== action.payload
        );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setTheme: setThemeReducer,
    toggleTheme: toggleThemeReducer,
    setSidebarOpen: setSidebarOpenReducer,
    toggleSidebar: toggleSidebarReducer,
    setLoading: (
      state, action: PayloadAction<boolean>
    ) => { state.loading = action.payload; },
    setLoadingMessage: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.loadingMessage = action.payload;
    },
  },
});

export const {
  openModal, closeModal, toggleModal,
  setNotification, removeNotification,
  clearNotifications, setTheme, toggleTheme,
  setSidebarOpen, toggleSidebar,
  setLoading, setLoadingMessage,
} = uiSlice.actions;

export default uiSlice.reducer;
