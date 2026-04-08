/**
 * Types and constants for SyncQueue
 */

import type { SyncQueueEntry } from './types'

/** IndexedDB store name for sync queue */
export const QUEUE_STORE = '_sync_queue'

/** Max retries before discarding an entry */
export const MAX_RETRIES = 5

/** Function that replays a mutation */
export type FlushRequestFn = (
  entity: string,
  operation: SyncQueueEntry['operation'],
  data: Record<string, unknown>
) => Promise<unknown>
