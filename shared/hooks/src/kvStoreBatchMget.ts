'use client'

/**
 * KV batch mget/mset operations
 */

import { useCallback } from 'react'
import type {
  DBALClientConfig,
  StorableValue,
} from './types'
import { buildKVUrl, jsonFetch } from './kvStoreHelpers'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create mget/mset KV callbacks */
export function createKVMgetOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const mget = useCallback(
    async (keys: string[], signal?: AbortSignal) => {
      return withState(async () => {
        const url = buildKVUrl(config) + '/_mget'
        const result = await jsonFetch<
          Record<string, StorableValue | null>
        >(
          url,
          { method: 'POST', body: JSON.stringify({ keys }), signal },
          config.headers
        )
        return new Map(Object.entries(result))
      })
    },
    [config, withState]
  )

  const mset = useCallback(
    async (entries: Map<string, StorableValue>, signal?: AbortSignal) => {
      return withState(async () => {
        const url = buildKVUrl(config) + '/_mset'
        await jsonFetch<void>(
          url,
          { method: 'POST', body: JSON.stringify({ entries: Object.fromEntries(entries) }), signal },
          config.headers
        )
      })
    },
    [config, withState]
  )

  return { mget, mset }
}
