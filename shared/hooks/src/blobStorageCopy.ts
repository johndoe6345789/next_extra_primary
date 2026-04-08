'use client'

/**
 * Blob copy operation
 */

import { useCallback } from 'react'
import type {
  DBALClientConfig,
  BlobMetadata,
} from './types'
import {
  buildBlobUrl,
  handleError,
} from './blobStorageHelpers'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create the copy callback */
export function createBlobCopy(
  config: DBALClientConfig,
  withState: WithState
) {
  return useCallback(
    async (
      srcKey: string,
      destKey: string,
      signal?: AbortSignal
    ) =>
      withState(async () => {
        const url =
          buildBlobUrl(config, srcKey) + '/copy'
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          body: JSON.stringify({ destKey }),
          signal,
        })
        if (!res.ok) await handleError(res)
        return (await res.json()) as BlobMetadata
      }),
    [config, withState]
  )
}
