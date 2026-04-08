/**
 * Slice exports for editor, connection, UI, auth
 */

export {
  editorSlice, type EditorState
} from '../slices/editorSlice';
export {
  setZoom, zoomIn, zoomOut, resetZoom,
  setPan, panBy, selectNode, toggleNodeSelection,
  showContextMenu, hideContextMenu, setCanvasSize
} from '../slices/editorSlice';

export {
  connectionSlice, type ConnectionState
} from '../slices/connectionSlice';
export {
  startConnection, updateConnectionPosition,
  validateConnection, completeConnection,
  cancelConnection, setValidationError,
  resetConnection
} from '../slices/connectionSlice';

export {
  uiSlice, type UIState
} from '../slices/uiSlice';
export {
  openModal, closeModal, toggleModal,
  setNotification, removeNotification,
  clearNotifications, setTheme, toggleTheme,
  setSidebarOpen, toggleSidebar,
  setLoading as setUILoading, setLoadingMessage
} from '../slices/uiSlice';

export {
  authSlice, type AuthState, type User
} from '../slices/authSlice';
export {
  setLoading as setAuthLoading, setError,
  setAuthenticated, setUser, logout, clearError,
  restoreFromStorage,
  selectUser, selectIsAuthenticated,
  selectIsLoading as selectAuthLoading,
  selectError as selectAuthError
} from '../slices/authSlice';
