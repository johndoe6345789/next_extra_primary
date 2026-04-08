/**
 * Type definitions for unified storage system
 */

/** Storage backend types */
export type StorageBackendType =
  | 'indexeddb'
  | 'sqlite'
  | 'flask'
  | 'memory'

/** Interface for storage backend implementations */
export interface StorageBackendAdapter {
  get<T>(key: string): Promise<T | undefined>
  set<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<void>
  getBackend(): Promise<StorageBackendType>
  switchToFlask(backendUrl?: string): Promise<void>
  switchToIndexedDB(): Promise<void>
  switchToSQLite(): Promise<void>
  exportData(): Promise<Record<string, unknown>>
  importData(
    data: Record<string, unknown>
  ): Promise<void>
}

/** Default no-op storage adapter */
export const defaultStorageAdapter: StorageBackendAdapter = {
  async get<T>(): Promise<T | undefined> {
    return undefined
  },
  async set(): Promise<void> {},
  async delete(): Promise<void> {},
  async getBackend(): Promise<StorageBackendType> {
    return 'memory'
  },
  async switchToFlask(): Promise<void> {
    console.warn(
      'Storage adapter not configured: switchToFlask'
    )
  },
  async switchToIndexedDB(): Promise<void> {
    console.warn(
      'Storage adapter not configured: switchToIndexedDB'
    )
  },
  async switchToSQLite(): Promise<void> {
    console.warn(
      'Storage adapter not configured: switchToSQLite'
    )
  },
  async exportData(): Promise<Record<string, unknown>> {
    return {}
  },
  async importData(): Promise<void> {
    console.warn(
      'Storage adapter not configured: importData'
    )
  },
}
