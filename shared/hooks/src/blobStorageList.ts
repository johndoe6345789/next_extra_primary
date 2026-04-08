'use client'

/**
 * Blob list operation
 */

import { useCallback } from 'react'
import type {
  DBALClientConfig,
  BlobListResult,
  BlobListOptions,
} from './types'
import {
  buildBlobUrl,
  handleError,
} from './blobStorageHelpers'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create the listBlobs callback */
export function createBlobList(
  config: DBALClientConfig,
  withState: WithState
) {
  return useCallback(
    async (
      options?: BlobListOptions,
      signal?: AbortSignal
    ) =>
      withState(async () => {
        const url = buildBlobUrl(config)
        const p = new URLSearchParams()
        if (options?.prefix) {
          p.set('prefix', options.prefix)
        }
        if (options?.continuationToken) {
          p.set(
            'continuationToken',
            options.continuationToken
          )
        }
        if (options?.maxKeys !== undefined) {
          p.set('maxKeys', String(options.maxKeys))
        }
        const qs = p.toString()
        const full = qs ? `${url}?${qs}` : url
        const res = await fetch(full, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            ...config.headers,
          },
          signal,
        })
        if (!res.ok) await handleError(res)
        return (await res.json()) as BlobListResult
      }),
    [config, withState]
  )
}
