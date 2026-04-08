'use client'

/**
 * Blob presign and stats operations
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

/** Create the getPresignedUrl callback */
export function createBlobPresign(
  config: DBALClientConfig,
  withState: WithState
) {
  return useCallback(
    async (
      key: string,
      expSecs?: number,
      signal?: AbortSignal
    ) =>
      withState(async () => {
        const url = buildBlobUrl(config, key) + '/presign'
        const p = new URLSearchParams()
        if (expSecs !== undefined) p.set('expires', String(expSecs))
        const qs = p.toString()
        const full = qs ? `${url}?${qs}` : url
        const res = await fetch(full, {
          method: 'GET',
          headers: { Accept: 'application/json', ...config.headers },
          signal,
        })
        if (!res.ok) await handleError(res)
        const json = await res.json()
        return json.url ?? json.presignedUrl ?? ''
      }),
    [config, withState]
  )
}

/** Create stats fetch callbacks */
export function createBlobStatOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const fetchStats = async (signal?: AbortSignal) =>
    withState(async () => {
      const url = buildBlobUrl(config) + '/_stats'
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json', ...config.headers },
        signal,
      })
      if (!res.ok) await handleError(res)
      return await res.json()
    })
  const getTotalSize = useCallback(
    async (signal?: AbortSignal) => {
      const j = await fetchStats(signal)
      return j.totalSize ?? j.totalSizeBytes ?? 0
    }, [config, withState]
  )
  const getObjectCount = useCallback(
    async (signal?: AbortSignal) => {
      const j = await fetchStats(signal)
      return j.objectCount ?? j.count ?? 0
    }, [config, withState]
  )
  return { getTotalSize, getObjectCount }
}
