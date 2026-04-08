/**
 * Types for useEmailSync hook
 */

/** Return type of useEmailSync */
export interface UseEmailSyncResult {
  /** Trigger email sync */
  sync: () => Promise<void>
  /** Whether sync is in progress */
  isSyncing: boolean
  /** Progress percentage (0-100) */
  progress: number
  /** Last successful sync timestamp */
  lastSync: number | null
  /** Error if sync failed */
  error: Error | null
}

/** Internal sync state */
export interface SyncState {
  isSyncing: boolean
  progress: number
  lastSync: number | null
  error: Error | null
}

/** Sync hook options */
export interface EmailSyncOptions {
  autoSync?: boolean
  syncInterval?: number
  onSyncComplete?: () => void
  onSyncError?: (error: Error) => void
}
