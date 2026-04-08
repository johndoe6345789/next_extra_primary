/**
 * Core SyncQueue operations
 * (enqueue, dequeue, peek)
 */

import type { SyncQueueEntry } from './types'
import { QUEUE_STORE } from './syncQueueTypes'
import { OfflineStore } from './useIndexedDB'

/** Parse raw OfflineRecords to queue entries */
export async function getAllEntries(
  store: OfflineStore
): Promise<SyncQueueEntry[]> {
  const records = await store.getAll(QUEUE_STORE)
  return records.map((r) => ({
    id: r.id,
    entity: r.entity as string,
    operation:
      r.operation as SyncQueueEntry['operation'],
    data: r.data as Record<string, unknown>,
    timestamp: r.timestamp as number,
    retries: r.retries as number,
  }))
}

/** Generate a unique queue entry ID */
export function generateId(): string {
  const rand = Math.random()
    .toString(36)
    .slice(2, 9)
  return `sq_${Date.now()}_${rand}`
}

/** Enqueue a mutation to the store */
export async function enqueueEntry(
  store: OfflineStore,
  mutation: Pick<
    SyncQueueEntry,
    'entity' | 'operation' | 'data'
  >
): Promise<SyncQueueEntry | undefined> {
  const entry: SyncQueueEntry = {
    id: generateId(),
    entity: mutation.entity,
    operation: mutation.operation,
    data: mutation.data,
    timestamp: Date.now(),
    retries: 0,
  }
  await store.put(QUEUE_STORE, {
    id: entry.id,
    entity: entry.entity,
    operation: entry.operation,
    data: entry.data,
    timestamp: entry.timestamp,
    retries: entry.retries,
    _syncStatus: 'synced',
  })
  return entry
}

/** Dequeue the oldest entry */
export async function dequeueEntry(
  store: OfflineStore
): Promise<SyncQueueEntry | undefined> {
  const entries = await getAllEntries(store)
  if (!entries.length) return undefined
  entries.sort(
    (a, b) => a.timestamp - b.timestamp
  )
  const oldest = entries[0]
  await store.delete(QUEUE_STORE, oldest.id)
  return oldest
}

/** Peek at the oldest entry */
export async function peekEntry(
  store: OfflineStore
): Promise<SyncQueueEntry | undefined> {
  const entries = await getAllEntries(store)
  if (!entries.length) return undefined
  entries.sort(
    (a, b) => a.timestamp - b.timestamp
  )
  return entries[0]
}
