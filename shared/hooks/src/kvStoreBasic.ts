'use client'

/**
 * Basic KV store operations (get/set/remove/exists)
 */

import { useCallback } from 'react'
import type {
  DBALClientConfig,
  StorableValue,
} from './types'
import { buildKVUrl, jsonFetch } from './kvStoreHelpers'
import { createKVWriteOps } from './kvStoreBasicWrite'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create basic KV callbacks */
export function createKVBasicOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const get = useCallback(
    async (
      key: string,
      signal?: AbortSignal
    ) => {
      return withState(async () => {
        const url = buildKVUrl(config, key)
        return jsonFetch<StorableValue | null>(
          url,
          { method: 'GET', signal },
          config.headers
        )
      })
    },
    [config, withState]
  )

  const { set, remove } =
    createKVWriteOps(config, withState)

  const exists = useCallback(
    async (
      key: string,
      signal?: AbortSignal
    ) => {
      return withState(async () => {
        const url = buildKVUrl(config, key)
        const res = await fetch(url, {
          method: 'HEAD',
          headers: config.headers,
          signal,
        })
        return res.ok
      })
    },
    [config, withState]
  )

  return { get, set, remove, exists }
}
