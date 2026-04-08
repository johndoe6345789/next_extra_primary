/**
 * Type definitions for useStorageSwitchHandlers
 */

import type { StorageBackendKey } from './storageSettingsConfig'
import type { ToastNotifier } from './useStorageDataHandlers'

/** Toast notifier with info method */
export type ToastNotifierWithInfo =
  ToastNotifier & {
    info: (message: string) => void
  }

/** Default no-op toast */
export const noopToast: ToastNotifierWithInfo =
  {
    success: () => {},
    error: () => {},
    info: () => {},
  }

/** Parameters for useStorageSwitchHandlers */
export type SwitchHandlersParams = {
  backend: StorageBackendKey | null
  flaskUrl: string
  switchToFlask: (
    url: string
  ) => Promise<void>
  switchToSQLite: () => Promise<void>
  switchToIndexedDB: () => Promise<void>
  /** Optional toast notifier */
  toast?: ToastNotifierWithInfo
}
