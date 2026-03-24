/**
 * UI slice — sidebar, panels, modals.
 * @module store/slices/uiSlice
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  notificationPanelOpen: boolean;
  activeModal: string | null;
}

const initialState: UiState = {
  sidebarOpen: true,
  notificationPanelOpen: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /** Toggle the main sidebar open/closed. */
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    /** Toggle the notification panel. */
    toggleNotificationPanel(state) {
      state.notificationPanelOpen = !state.notificationPanelOpen;
    },
    /** Set or clear the active modal by key. */
    setActiveModal(state, action: PayloadAction<string | null>) {
      state.activeModal = action.payload;
    },
  },
});

export const { toggleSidebar, toggleNotificationPanel, setActiveModal } =
  uiSlice.actions;

export default uiSlice.reducer;
