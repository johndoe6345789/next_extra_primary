/**
 * Type definitions for UI state
 */

/** Notification type */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/** UI state shape */
export interface UIState {
  modals: {
    createWorkflow: boolean;
    importWorkflow: boolean;
    settings: boolean;
    nodeHelp: boolean;
  };
  notifications: Notification[];
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  loadingMessage: string | null;
}

/** Initial UI state */
export const uiInitialState: UIState = {
  modals: {
    createWorkflow: false,
    importWorkflow: false,
    settings: false,
    nodeHelp: false
  },
  notifications: [],
  theme: 'light',
  sidebarOpen: true,
  loading: false,
  loadingMessage: null
};
