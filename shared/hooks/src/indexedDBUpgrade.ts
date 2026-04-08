/**
 * IndexedDB upgrade/store creation handlers
 */

import { RESERVED_STORE } from './indexedDBTypes'

/**
 * Handle onupgradeneeded for IndexedDB
 * @param db - Database instance
 * @param storeName - Optional entity store
 */
export function handleUpgrade(
  db: IDBDatabase,
  storeName?: string
): void {
  if (
    !db.objectStoreNames.contains(
      RESERVED_STORE
    )
  ) {
    const s = db.createObjectStore(
      RESERVED_STORE,
      { keyPath: 'id' }
    )
    s.createIndex(
      'timestamp',
      'timestamp',
      { unique: false }
    )
  }
  if (
    storeName &&
    !db.objectStoreNames.contains(storeName)
  ) {
    const es = db.createObjectStore(
      storeName,
      { keyPath: 'id' }
    )
    es.createIndex(
      '_syncStatus',
      '_syncStatus',
      { unique: false }
    )
    es.createIndex(
      '_localUpdatedAt',
      '_localUpdatedAt',
      { unique: false }
    )
  }
}
