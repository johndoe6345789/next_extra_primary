'use client'

/**
 * useOfflineSync Hook
 * Orchestrates offline/online sync for DBAL.
 */

import { useState, useCallback, useRef } from 'react'
import type { DBALClientConfig } from './types'
import type {
  UseOfflineSyncReturn,
} from './offlineSyncTypes'
import { SyncQueue } from './useSyncQueue'
import {
  useOfflineSyncPoll,
} from './offlineSyncPoll'
import {
  useOfflineSyncActions,
} from './offlineSyncActions'

export type {
  UseOfflineSyncReturn,
} from './offlineSyncTypes'

/**
 * Hook for managing offline/online sync
 * @param config - DBAL client configuration
 */
export function useOfflineSync(
  config: DBALClientConfig = {}
): UseOfflineSyncReturn {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] =
    useState(0)
  const [lastSyncAt, setLastSyncAt] =
    useState<Date | null>(null)

  const cfgRef = useRef(config)
  cfgRef.current = config

  const {
    checkHealth, buildSyncNow, clearQueue,
  } = useOfflineSyncActions(cfgRef)

  const syncNow = useCallback(
    buildSyncNow(setPendingCount, setLastSyncAt),
    [buildSyncNow]
  )

  const clearAndReset = useCallback(
    async () => {
      await clearQueue()
      setPendingCount(0)
    },
    [clearQueue]
  )

  useOfflineSyncPoll(
    checkHealth, syncNow,
    setIsOnline, setPendingCount
  )

  return {
    isOnline, pendingCount, lastSyncAt,
    syncNow, clearQueue: clearAndReset,
  }
}
