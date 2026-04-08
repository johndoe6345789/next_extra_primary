/**
 * SyncQueue - mutation queue backed by
 * IndexedDB for offline sync.
 * SSR-safe: resolves gracefully when unavailable.
 */

import type { SyncQueueEntry } from './types'
import type { FlushRequestFn } from './syncQueueTypes'
import {
  enqueueEntry,
  dequeueEntry,
  peekEntry,
} from './syncQueueCore'
import {
  isIDBAvailable,
  getStore,
  flushQueue,
  countQueue,
  clearQueue,
} from './syncQueueMethods'

/** Singleton offline mutation queue */
export class SyncQueue {
  private static instance: SyncQueue | null =
    null
  private constructor() {}

  /** Get singleton instance */
  static getInstance(): SyncQueue {
    if (!SyncQueue.instance) {
      SyncQueue.instance = new SyncQueue()
    }
    return SyncQueue.instance
  }

  /** Reset singleton (testing only) */
  static resetInstance(): void {
    SyncQueue.instance = null
  }

  /** Add a mutation to the queue */
  async enqueue(
    mutation: Pick<
      SyncQueueEntry,
      'entity' | 'operation' | 'data'
    >
  ): Promise<SyncQueueEntry | undefined> {
    if (!isIDBAvailable()) return undefined
    return enqueueEntry(getStore(), mutation)
  }

  /** Remove and return the oldest entry */
  async dequeue(): Promise<
    SyncQueueEntry | undefined
  > {
    if (!isIDBAvailable()) return undefined
    return dequeueEntry(getStore())
  }

  /** Peek at the oldest entry */
  async peek(): Promise<
    SyncQueueEntry | undefined
  > {
    if (!isIDBAvailable()) return undefined
    return peekEntry(getStore())
  }

  /** Flush queued mutations via requestFn */
  async flush(
    requestFn: FlushRequestFn
  ): Promise<number> {
    if (!isIDBAvailable()) return 0
    return flushQueue(getStore(), requestFn)
  }

  /** Count pending mutations */
  async count(): Promise<number> {
    if (!isIDBAvailable()) return 0
    return countQueue(getStore())
  }

  /** Clear all pending mutations */
  async clear(): Promise<void> {
    if (!isIDBAvailable()) return
    await clearQueue(getStore())
  }
}
