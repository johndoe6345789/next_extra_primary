import { useState, useEffect } from 'react'
import type {
  SyncState,
  UseEmailSyncResult,
  EmailSyncOptions,
} from './emailSyncTypes'
import { useSyncRunner } from './emailSyncRunner'

export type {
  UseEmailSyncResult,
  EmailSyncOptions,
} from './emailSyncTypes'

/**
 * Hook for email sync with progress tracking
 * @param options - Sync configuration
 */
export function useEmailSync(
  options?: EmailSyncOptions
): UseEmailSyncResult {
  const [state, setState] =
    useState<SyncState>({
      isSyncing: false,
      progress: 0,
      lastSync: null,
      error: null,
    })

  const sync = useSyncRunner(setState, options)

  useEffect(() => {
    if (!options?.autoSync) return
    const interval = setInterval(
      () => sync(),
      options?.syncInterval || 5 * 60 * 1000
    )
    return () => clearInterval(interval)
  }, [
    sync,
    options?.autoSync,
    options?.syncInterval,
  ])

  return {
    sync,
    isSyncing: state.isSyncing,
    progress: state.progress,
    lastSync: state.lastSync,
    error: state.error,
  }
}
