'use client'

/**
 * KV batch query operations (listKeys, count, clear)
 */

import { useCallback } from 'react'
import type {
  DBALClientConfig,
  KVListOptions,
  KVListResult,
} from './types'
import { buildKVUrl, jsonFetch } from './kvStoreHelpers'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create query-type KV callbacks */
export function createKVQueryOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const listKeys = useCallback(
    async (options?: KVListOptions, signal?: AbortSignal) => {
      return withState(async () => {
        const url = buildKVUrl(config)
        const p = new URLSearchParams()
        if (options?.prefix) p.set('prefix', options.prefix)
        if (options?.limit !== undefined) p.set('limit', String(options.limit))
        if (options?.cursor) p.set('cursor', options.cursor)
        const qs = p.toString()
        const full = qs ? `${url}?${qs}` : url
        return jsonFetch<KVListResult>(full, { method: 'GET', signal }, config.headers)
      })
    },
    [config, withState]
  )

  const count = useCallback(
    async (prefix?: string, signal?: AbortSignal) => {
      return withState(async () => {
        const url = buildKVUrl(config) + '/_count'
        return jsonFetch<number>(
          url,
          { method: 'POST', body: JSON.stringify({ prefix: prefix ?? '' }), signal },
          config.headers
        )
      })
    },
    [config, withState]
  )

  const clear = useCallback(
    async (signal?: AbortSignal) => {
      return withState(async () => {
        const url = buildKVUrl(config) + '/_clear'
        return jsonFetch<number>(url, { method: 'POST', signal })
      })
    },
    [config, withState]
  )

  return { list: listKeys, count, clear }
}
