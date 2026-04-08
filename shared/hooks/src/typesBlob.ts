/**
 * Blob storage types for DBAL REST API
 */

/** Blob metadata returned by the API */
export interface BlobMetadata {
  key: string
  size: number
  contentType: string
  etag: string
  lastModified: string
  customMetadata?: Record<string, string>
}

/** Blob list result */
export interface BlobListResult {
  items: BlobMetadata[]
  nextToken?: string
  isTruncated: boolean
}

/** Options for listing blobs */
export interface BlobListOptions {
  prefix?: string
  continuationToken?: string
  maxKeys?: number
}

/** Options for uploading blobs */
export interface BlobUploadOptions {
  contentType?: string
  metadata?: Record<string, string>
  overwrite?: boolean
}
