'use client'

/**
 * Query blob operations
 * Composes from split operation files.
 */

import type { DBALClientConfig } from './types'
import {
  createBlobExists,
  createBlobGetMetadata,
} from './blobStorageMeta'
import { createBlobList } from './blobStorageList'
import { createBlobCopy } from './blobStorageCopy'
import {
  createBlobPresign,
  createBlobStatOps,
} from './blobStorageStats'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create query blob callbacks */
export function createBlobQueryOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const exists = createBlobExists(
    config, withState
  )
  const getMetadata = createBlobGetMetadata(
    config, withState
  )
  const list = createBlobList(
    config, withState
  )
  const getPresignedUrl = createBlobPresign(
    config, withState
  )
  const copy = createBlobCopy(
    config, withState
  )
  const { getTotalSize, getObjectCount } =
    createBlobStatOps(config, withState)

  return {
    exists,
    getMetadata,
    list,
    getPresignedUrl,
    copy,
    getTotalSize,
    getObjectCount,
  }
}
