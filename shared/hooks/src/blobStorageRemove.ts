'use client'

/**
 * Blob download and remove operations
 */

import { useCallback } from 'react'
import type { DBALClientConfig } from './types'
import {
  buildBlobUrl,
  handleError,
} from './blobStorageHelpers'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create the download callback */
export function createBlobDownload(
  config: DBALClientConfig,
  withState: WithState
) {
  return useCallback(
    async (
      key: string,
      signal?: AbortSignal
    ) => {
      return withState(async () => {
        const url = buildBlobUrl(config, key)
        const res = await fetch(url, {
          method: 'GET',
          headers: config.headers,
          signal,
        })
        if (!res.ok) await handleError(res)
        return res.blob()
      })
    },
    [config, withState]
  )
}

/** Create the remove callback */
export function createBlobRemove(
  config: DBALClientConfig,
  withState: WithState
) {
  return useCallback(
    async (
      key: string,
      signal?: AbortSignal
    ) => {
      return withState(async () => {
        const url = buildBlobUrl(config, key)
        const res = await fetch(url, {
          method: 'DELETE',
          headers: config.headers,
          signal,
        })
        if (!res.ok) await handleError(res)
        const json = await res.json()
        return (
          json.success ?? json.deleted ?? true
        )
      })
    },
    [config, withState]
  )
}
