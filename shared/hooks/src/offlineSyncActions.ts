'use client'

/**
 * Offline sync action callbacks
 */

import { useCallback, useRef } from 'react'
import type { DBALClientConfig } from './types'
import {
  checkApiHealth,
  executeMutation,
} from './offlineSyncMutation'
import { SyncQueue } from './useSyncQueue'

type SetCount = React.Dispatch<
  React.SetStateAction<number>
>
type SetDate = React.Dispatch<
  React.SetStateAction<Date | null>
>

/**
 * Build syncNow and clearQueue callbacks
 * @param cfgRef - Config ref
 */
export function useOfflineSyncActions(
  cfgRef: React.MutableRefObject<
    DBALClientConfig
  >
) {
  const isFlushing = useRef(false)

  const checkHealth = useCallback(async () => {
    const base = cfgRef.current.baseUrl ?? ''
    return checkApiHealth(base)
  }, [])

  const doMutation = useCallback(
    async (
      entity: string,
      op: 'create' | 'update' | 'delete',
      data: Record<string, unknown>
    ) =>
      executeMutation(
        cfgRef.current, entity, op, data
      ),
    []
  )

  const buildSyncNow = (
    setPendingCount: SetCount,
    setLastSyncAt: SetDate
  ) =>
    async () => {
      if (isFlushing.current) return 0
      isFlushing.current = true
      try {
        const q = SyncQueue.getInstance()
        const flushed = await q.flush(doMutation)
        if (flushed > 0)
          setLastSyncAt(new Date())
        const rem = await q.count()
        setPendingCount(rem)
        return flushed
      } finally {
        isFlushing.current = false
      }
    }

  const clearQueue = useCallback(async () => {
    const q = SyncQueue.getInstance()
    await q.clear()
  }, [])

  return {
    checkHealth,
    doMutation,
    buildSyncNow,
    clearQueue,
  }
}
