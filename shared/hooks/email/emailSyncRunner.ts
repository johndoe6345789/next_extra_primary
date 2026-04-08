/**
 * Email sync execution logic
 */

import { useCallback } from 'react'
import type {
  SyncState,
  EmailSyncOptions,
} from './emailSyncTypes'

type SetState = React.Dispatch<
  React.SetStateAction<SyncState>
>

/**
 * Build sync callback
 * @param setState - State setter
 * @param options - Sync options
 */
export function useSyncRunner(
  setState: SetState,
  options?: EmailSyncOptions
) {
  return useCallback(async () => {
    setState((p) => ({
      ...p,
      isSyncing: true,
      error: null,
    }))
    try {
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((r) =>
          setTimeout(r, 100)
        )
        setState((p) => ({
          ...p,
          progress: i,
        }))
      }
      const now = Date.now()
      setState((p) => ({
        ...p,
        isSyncing: false,
        progress: 100,
        lastSync: now,
        error: null,
      }))
      options?.onSyncComplete?.()
    } catch (err) {
      const e =
        err instanceof Error
          ? err
          : new Error('Sync failed')
      setState((p) => ({
        ...p,
        isSyncing: false,
        error: e,
      }))
      options?.onSyncError?.(e)
    }
  }, [options])
}
