'use client'

/**
 * Basic KV store write operations (set/remove)
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

/** Create basic KV write callbacks */
export function createKVWriteOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const set = useCallback(
    async (
      key: string,
      value: StorableValue,
      ttl?: number,
      signal?: AbortSignal
    ) => {
      return withState(async () => {
        const url = buildKVUrl(config, key)
        const body: Record<string, unknown> = {
          value,
        }
        if (ttl !== undefined) body.ttl = ttl
        await jsonFetch<void>(
          url,
          {
            method: 'PUT',
            body: JSON.stringify(body),
            signal,
          },
          config.headers
        )
      })
    },
    [config, withState]
  )

  const remove = useCallback(
    async (
      key: string,
      signal?: AbortSignal
    ) => {
      return withState(async () => {
        const url = buildKVUrl(config, key)
        return jsonFetch<boolean>(
          url,
          { method: 'DELETE', signal },
          config.headers
        )
      })
    },
    [config, withState]
  )

  return { set, remove }
}
