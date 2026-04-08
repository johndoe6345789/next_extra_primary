/**
 * Flush logic for SyncQueue
 */

import type { SyncQueueEntry } from './types'
import type { FlushRequestFn } from './syncQueueTypes'
import {
  QUEUE_STORE,
  MAX_RETRIES,
} from './syncQueueTypes'
import { OfflineStore } from './useIndexedDB'

/**
 * Replay all queued mutations in FIFO order.
 * Stops on first failure to maintain order.
 *
 * @param entries - Sorted queue entries
 * @param requestFn - Sends a mutation
 * @returns Number of flushed mutations
 */
export async function flushEntries(
  entries: SyncQueueEntry[],
  requestFn: FlushRequestFn
): Promise<number> {
  const store = OfflineStore.getInstance()
  let flushed = 0

  for (const entry of entries) {
    try {
      await requestFn(
        entry.entity,
        entry.operation,
        entry.data
      )
      await store.delete(
        QUEUE_STORE,
        entry.id
      )
      flushed++
    } catch {
      const retries = entry.retries + 1
      if (retries >= MAX_RETRIES) {
        await store.delete(
          QUEUE_STORE,
          entry.id
        )
      } else {
        await store.put(QUEUE_STORE, {
          id: entry.id,
          entity: entry.entity,
          operation: entry.operation,
          data: entry.data,
          timestamp: entry.timestamp,
          retries,
          _syncStatus: 'synced',
        })
      }
      break
    }
  }

  return flushed
}
