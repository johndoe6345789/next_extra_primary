'use client'

/**
 * Types and constants for useOfflineSync
 */

import type { OfflineSyncState } from './types'

/** Default health check interval (ms) */
export const POLL_INTERVAL_MS = 30_000

/** Health check timeout (ms) */
export const HEALTH_TIMEOUT_MS = 5_000

/** Return type of useOfflineSync */
export interface UseOfflineSyncReturn
  extends OfflineSyncState {
  /** Manually trigger a sync flush */
  syncNow: () => Promise<number>
  /** Discard all pending mutations */
  clearQueue: () => Promise<void>
}
