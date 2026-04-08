/**
 * SyncQueue convenience methods
 * (count, clear, availability check)
 */

import type { SyncQueueEntry } from './types'
import type { FlushRequestFn } from './syncQueueTypes'
import { QUEUE_STORE } from './syncQueueTypes'
import { OfflineStore } from './useIndexedDB'
import { flushEntries } from './syncQueueFlush'
import {
  getAllEntries,
} from './syncQueueCore'

/** Check if IndexedDB is available */
export function isIDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined'
}

/** Get the OfflineStore singleton */
export function getStore(): OfflineStore {
  return OfflineStore.getInstance()
}

/** Flush queued mutations via requestFn */
export async function flushQueue(
  store: OfflineStore,
  requestFn: FlushRequestFn
): Promise<number> {
  const entries = await getAllEntries(store)
  if (!entries.length) return 0
  entries.sort(
    (a, b) => a.timestamp - b.timestamp
  )
  return flushEntries(entries, requestFn)
}

/** Count pending mutations */
export async function countQueue(
  store: OfflineStore
): Promise<number> {
  return store.count(QUEUE_STORE)
}

/** Clear all pending mutations */
export async function clearQueue(
  store: OfflineStore
): Promise<void> {
  await store.clear(QUEUE_STORE)
}
