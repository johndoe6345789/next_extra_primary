'use client'

/**
 * KV list read operations (get, length)
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

/** Create read-only KV list callbacks */
export function createKVListReadOps(
  config: DBALClientConfig,
  withState: WithState
) {
  /** Get list items by range */
  const listGet = useCallback(
    async (
      key: string,
      start?: number,
      end?: number,
      signal?: AbortSignal
    ) => {
      return withState(async () => {
        const url =
          buildKVUrl(config, key) + '/list'
        const p = new URLSearchParams()
        if (start !== undefined) {
          p.set('start', String(start))
        }
        if (end !== undefined) {
          p.set('end', String(end))
        }
        const qs = p.toString()
        const full = qs ? `${url}?${qs}` : url
        return jsonFetch<StorableValue[]>(
          full,
          { method: 'GET', signal },
          config.headers
        )
      })
    },
    [config, withState]
  )

  /** Get the length of a list */
  const listLength = useCallback(
    async (
      key: string,
      signal?: AbortSignal
    ) => {
      return withState(async () => {
        const url =
          buildKVUrl(config, key) + '/list'
        const res = await fetch(url, {
          method: 'HEAD',
          headers: config.headers,
          signal,
        })
        return parseInt(
          res.headers.get('x-list-length') ??
            '0',
          10
        )
      })
    },
    [config, withState]
  )

  return { listGet, listLength }
}
