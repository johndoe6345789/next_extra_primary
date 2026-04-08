/**
 * UI reducers that persist to localStorage
 * Theme and sidebar state
 */

import type { PayloadAction } from
  '@reduxjs/toolkit';
import type { UIState } from './uiTypes';

/** Set theme and persist */
export const setThemeReducer = (
  state: UIState,
  action: PayloadAction<'light' | 'dark'>
) => {
  state.theme = action.payload;
  localStorage.setItem(
    'workflow-theme', action.payload
  );
};

/** Toggle theme and persist */
export const toggleThemeReducer = (
  state: UIState
) => {
  state.theme =
    state.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem(
    'workflow-theme', state.theme
  );
};

/** Set sidebar open state and persist */
export const setSidebarOpenReducer = (
  state: UIState,
  action: PayloadAction<boolean>
) => {
  state.sidebarOpen = action.payload;
  localStorage.setItem(
    'sidebar-open', String(action.payload)
  );
};

/** Toggle sidebar and persist */
export const toggleSidebarReducer = (
  state: UIState
) => {
  state.sidebarOpen = !state.sidebarOpen;
  localStorage.setItem(
    'sidebar-open', String(state.sidebarOpen)
  );
};
