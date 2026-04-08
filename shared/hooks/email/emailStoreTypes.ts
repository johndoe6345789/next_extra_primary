/**
 * Types for useEmailStore hook
 */

/** Email message for IndexedDB storage */
export interface StoredMessage {
  id: string
  messageId: string
  from: string
  to: string[]
  subject: string
  body: string
  receivedAt: number
  isRead: boolean
  isStarred: boolean
  folderName: string
  createdAt: number
}

/** Return type of useEmailStore */
export interface UseEmailStoreResult {
  /** Retrieve all stored messages */
  getMessages: (
    folderName?: string
  ) => Promise<StoredMessage[]>
  /** Save messages to offline storage */
  saveMessages: (
    msgs: StoredMessage[]
  ) => Promise<void>
  /** Clear all stored messages */
  clear: () => Promise<void>
  /** Whether storage is initialized */
  isReady: boolean
  /** Error if initialization failed */
  error: Error | null
}

/** DB constants */
export const DB_NAME = 'metabuilder_email'
export const STORE_NAME = 'messages'
export const DB_VERSION = 1
