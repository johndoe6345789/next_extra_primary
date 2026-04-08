'use client'

/**
 * Blob upload operation
 */

import { useCallback } from 'react'
import type {
  DBALClientConfig,
  BlobMetadata,
  BlobUploadOptions,
} from './types'
import {
  buildBlobUrl,
  handleError,
} from './blobStorageHelpers'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create the upload callback */
export function createBlobUpload(
  config: DBALClientConfig,
  withState: WithState
) {
  return useCallback(
    async (
      key: string,
      data:
        | Blob
        | File
        | ArrayBuffer
        | Uint8Array,
      options?: BlobUploadOptions,
      signal?: AbortSignal
    ): Promise<BlobMetadata> => {
      return withState(async () => {
        const url = buildBlobUrl(config, key)
        const h: Record<string, string> = {
          ...config.headers,
        }
        const ct =
          options?.contentType ??
          (data instanceof File
            ? data.type
            : undefined) ??
          (data instanceof Blob
            ? data.type
            : undefined) ??
          'application/octet-stream'
        h['Content-Type'] = ct
        if (options?.overwrite !== undefined) {
          h['X-Blob-Overwrite'] = String(
            options.overwrite
          )
        }
        if (options?.metadata) {
          h['X-Blob-Metadata'] = JSON.stringify(
            options.metadata
          )
        }
        const body =
          data instanceof Blob ||
          data instanceof File
            ? data
            : new Blob([data as BlobPart])
        const res = await fetch(url, {
          method: 'PUT',
          headers: h,
          body,
          signal,
        })
        if (!res.ok) await handleError(res)
        return (await res.json()) as BlobMetadata
      })
    },
    [config, withState]
  )
}
