'use client'

/**
 * Type definitions for useKVStore hook
 */

import type {
  StorableValue,
  KVListOptions,
  KVListResult,
} from './types'

/** Return type of useKVStore */
export interface UseKVStoreReturn {
  loading: boolean
  error: Error | null
  get: (
    key: string,
    signal?: AbortSignal
  ) => Promise<StorableValue | null>
  set: (
    key: string,
    value: StorableValue,
    ttl?: number,
    signal?: AbortSignal
  ) => Promise<void>
  remove: (
    key: string,
    signal?: AbortSignal
  ) => Promise<boolean>
  exists: (
    key: string,
    signal?: AbortSignal
  ) => Promise<boolean>
  listAdd: (
    key: string,
    items: StorableValue[],
    signal?: AbortSignal
  ) => Promise<number>
  listGet: (
    key: string,
    start?: number,
    end?: number,
    signal?: AbortSignal
  ) => Promise<StorableValue[]>
  listRemove: (
    key: string,
    value: StorableValue,
    signal?: AbortSignal
  ) => Promise<number>
  listLength: (
    key: string,
    signal?: AbortSignal
  ) => Promise<number>
  listClear: (
    key: string,
    signal?: AbortSignal
  ) => Promise<void>
  mget: (
    keys: string[],
    signal?: AbortSignal
  ) => Promise<Map<string, StorableValue | null>>
  mset: (
    entries: Map<string, StorableValue>,
    signal?: AbortSignal
  ) => Promise<void>
  list: (
    options?: KVListOptions,
    signal?: AbortSignal
  ) => Promise<KVListResult>
  count: (
    prefix?: string,
    signal?: AbortSignal
  ) => Promise<number>
  clear: (
    signal?: AbortSignal
  ) => Promise<number>
  clearError: () => void
}
