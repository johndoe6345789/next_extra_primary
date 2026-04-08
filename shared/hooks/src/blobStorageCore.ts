'use client'

/**
 * Core blob operations (upload/download/remove)
 * Composes from split operation files.
 */

import type { DBALClientConfig } from './types'
import { createBlobUpload } from './blobStorageUpload'
import { createBlobDownload, createBlobRemove } from './blobStorageRemove'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create core blob callbacks */
export function createBlobCoreOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const upload = createBlobUpload(
    config,
    withState
  )
  const download = createBlobDownload(
    config,
    withState
  )
  const remove = createBlobRemove(
    config,
    withState
  )
  return { upload, download, remove }
}
