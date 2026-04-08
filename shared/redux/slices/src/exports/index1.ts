/**
 * Re-exports: types, canvas, and editor/UI slices
 */

export type {
  CanvasPosition, CanvasSize, Workspace,
  Project, ProjectCanvasItem, ProjectCanvasState,
  CollaborativeUser, CanvasUpdateEvent,
  Workflow, WorkflowNode, WorkflowConnection,
  NodeExecutionResult, ExecutionResult,
  AppDispatch, RootState
} from './types';

export {
  canvasSlice, setCanvasZoom, setCanvasPan,
  panCanvas, selectCanvasItem, addToSelection,
  toggleSelection, clearSelection,
  setDragging, setResizing, setGridSnap,
  setShowGrid, setSnapSize, resetCanvasView,
  removeFromSelection, setSelection,
  resetCanvasState,
  selectCanvasZoom, selectCanvasPan,
  selectGridSnap, selectShowGrid, selectSnapSize,
  selectIsDragging, selectIsResizing,
  selectSelectedItemIds,
  canvasItemsSlice, setCanvasItems, addCanvasItem,
  updateCanvasItem, removeCanvasItem,
  bulkUpdateCanvasItems, deleteCanvasItems,
  duplicateCanvasItems, applyAutoLayout,
  clearCanvasItems, selectCanvasItems,
  selectCanvasItemCount, selectCanvasItemById,
  selectCanvasItemsByIds
} from './canvasExports';

export {
  editorSlice, type EditorState,
  setZoom, zoomIn, zoomOut, resetZoom,
  setPan, panBy, selectNode,
  toggleNodeSelection, showContextMenu,
  hideContextMenu, setCanvasSize,
  connectionSlice, type ConnectionState,
  startConnection, updateConnectionPosition,
  validateConnection, completeConnection,
  cancelConnection, setValidationError,
  resetConnection,
  uiSlice, type UIState,
  openModal, closeModal, toggleModal,
  setNotification, removeNotification,
  clearNotifications, setTheme, toggleTheme,
  setSidebarOpen, toggleSidebar,
  setUILoading, setLoadingMessage,
  authSlice, type AuthState, type User,
  setAuthLoading, setError, setAuthenticated,
  setUser, logout, clearError,
  restoreFromStorage, selectUser,
  selectIsAuthenticated, selectAuthLoading,
  selectAuthError
} from './sliceExports';
