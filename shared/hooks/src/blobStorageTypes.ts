'use client'

/**
 * Type definitions for useBlobStorage hook
 */

import type {
  BlobMetadata,
  BlobListResult,
  BlobListOptions,
  BlobUploadOptions,
} from './types'

/** Return type of useBlobStorage */
export interface UseBlobStorageReturn {
  loading: boolean
  error: Error | null
  upload: (
    key: string,
    data: Blob | File | ArrayBuffer | Uint8Array,
    options?: BlobUploadOptions,
    signal?: AbortSignal
  ) => Promise<BlobMetadata>
  download: (
    key: string,
    signal?: AbortSignal
  ) => Promise<Blob>
  remove: (
    key: string,
    signal?: AbortSignal
  ) => Promise<boolean>
  exists: (
    key: string,
    signal?: AbortSignal
  ) => Promise<boolean>
  getMetadata: (
    key: string,
    signal?: AbortSignal
  ) => Promise<BlobMetadata>
  list: (
    options?: BlobListOptions,
    signal?: AbortSignal
  ) => Promise<BlobListResult>
  getPresignedUrl: (
    key: string,
    expirationSeconds?: number,
    signal?: AbortSignal
  ) => Promise<string>
  copy: (
    sourceKey: string,
    destKey: string,
    signal?: AbortSignal
  ) => Promise<BlobMetadata>
  getTotalSize: (
    signal?: AbortSignal
  ) => Promise<number>
  getObjectCount: (
    signal?: AbortSignal
  ) => Promise<number>
  clearError: () => void
}
