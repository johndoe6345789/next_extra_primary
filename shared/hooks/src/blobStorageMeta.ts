'use client'

/**
 * Blob exists and metadata operations
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

/** Create the exists callback */
export function createBlobExists(
  config: DBALClientConfig,
  withState: WithState
) {
  return useCallback(
    async (key: string, signal?: AbortSignal) =>
      withState(async () => {
        const url = buildBlobUrl(config, key)
        const res = await fetch(url, {
          method: 'HEAD',
          headers: config.headers,
          signal,
        })
        return res.ok
      }),
    [config, withState]
  )
}

/** Create the getMetadata callback */
export function createBlobGetMetadata(
  config: DBALClientConfig,
  withState: WithState
) {
  return useCallback(
    async (key: string, signal?: AbortSignal) =>
      withState(async () => {
        const url = buildBlobUrl(config, key)
        const res = await fetch(url, {
          method: 'HEAD',
          headers: config.headers,
          signal,
        })
        if (!res.ok) await handleError(res)
        const raw = res.headers.get('x-blob-metadata')
        let customMetadata: unknown
        if (raw) {
          try { customMetadata = JSON.parse(raw) }
          catch { customMetadata = undefined }
        }
        return {
          key,
          size: parseInt(
            res.headers.get('content-length') ?? '0', 10
          ),
          contentType:
            res.headers.get('content-type') ??
            'application/octet-stream',
          etag: res.headers.get('etag') ?? '',
          lastModified:
            res.headers.get('last-modified') ??
            new Date().toISOString(),
          customMetadata,
        } as BlobMetadata
      }),
    [config, withState]
  )
}
