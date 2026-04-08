// Core hooks - basic state, form, and DOM
export { useDragResize } from './useDragResize'
export type {
  DragResizeItem,
  UseDragResizeParams,
  UseDragResizeReturn,
} from './useDragResize'
export { useLoginLogic } from './useLoginLogic'
export {
  useRegisterLogic,
} from './useRegisterLogic'
export {
  usePasswordValidation,
} from './usePasswordValidation'
export { useAuthForm } from './useAuthForm'
export {
  useDashboardLogic,
} from './useDashboardLogic'
export {
  useResponsiveSidebar,
} from './useResponsiveSidebar'
export { useHeaderLogic } from './useHeaderLogic'
export type {
  UseHeaderLogicReturn,
} from './useHeaderLogic'
export {
  useProjectSidebarLogic,
} from './useProjectSidebarLogic'
export {
  useStorageSettingsHandlers,
} from './useStorageSettingsHandlers'
export {
  useStorageDataHandlers,
} from './useStorageDataHandlers'
export type {
  ToastNotifier,
} from './useStorageDataHandlers'
export {
  useStorageSwitchHandlers,
} from './useStorageSwitchHandlers'
export type {
  ToastNotifierWithInfo,
} from './useStorageSwitchHandlers'
export {
  downloadJson,
  createJsonFileInput,
  formatStorageError,
} from './storageSettingsUtils'
export {
  storageSettingsCopy,
} from './storageSettingsConfig'
export type {
  StorageBackendKey,
} from './storageSettingsConfig'
export {
  useUnifiedStorage,
  useStorageBackend,
  configureStorageAdapter,
  getStorageAdapter,
} from './use-unified-storage'
export type {
  StorageBackendType,
  StorageBackendAdapter,
} from './use-unified-storage'

// Accessibility + Toast hooks
export * from './indexCoreAccessibility'

// Data, state, form exports
export * from './indexCoreFormData'
