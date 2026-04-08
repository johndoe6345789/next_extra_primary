'use client'

/**
 * List-type KV write operations (add, remove, clear)
 */

import { useCallback } from 'react'
import type { DBALClientConfig, StorableValue } from './types'
import { buildKVUrl, jsonFetch } from './kvStoreHelpers'

type WithState = <R>(fn: () => Promise<R>) => Promise<R>

/** Create list write callbacks */
export function createKVListWriteOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const listAdd = useCallback(
    async (key: string, items: StorableValue[], signal?: AbortSignal) => {
      return withState(async () => {
        const url = buildKVUrl(config, key) + '/list/add'
        return jsonFetch<number>(
          url, { method: 'POST', body: JSON.stringify({ items }), signal }, config.headers
        )
      })
    },
    [config, withState]
  )

  const listRemove = useCallback(
    async (key: string, value: StorableValue, signal?: AbortSignal) => {
      return withState(async () => {
        const url = buildKVUrl(config, key) + '/list/remove'
        return jsonFetch<number>(
          url, { method: 'POST', body: JSON.stringify({ value }), signal }, config.headers
        )
      })
    },
    [config, withState]
  )

  const listClear = useCallback(
    async (key: string, signal?: AbortSignal) => {
      return withState(async () => {
        const url = buildKVUrl(config, key) + '/list'
        await jsonFetch<void>(url, { method: 'DELETE', signal }, config.headers)
      })
    },
    [config, withState]
  )

  return { listAdd, listRemove, listClear }
}
