/**
 * IndexedDB connection management
 */

import { DB_NAME, DB_VERSION } from './indexedDBTypes'
import { handleUpgrade } from './indexedDBUpgrade'

/** Check if IndexedDB is available */
export function isIDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined'
}

/** Open/reopen IndexedDB, ensuring store */
export function openInternal(
  knownStores: Set<string>,
  prevDb: IDBDatabase | null,
  storeName?: string
): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    const prevVer = prevDb?.version
    if (prevDb) {
      prevDb.close()
    }

    const needsNew =
      storeName && !knownStores.has(storeName)
    const nextVer = prevVer != null
      ? prevVer + 1
      : needsNew
        ? knownStores.size + 2
        : DB_VERSION + knownStores.size

    let request: IDBOpenDBRequest
    try {
      request = indexedDB.open(
        DB_NAME,
        nextVer
      )
    } catch {
      resolve(null)
      return
    }

    request.onupgradeneeded = (event) => {
      const db = (
        event.target as IDBOpenDBRequest
      ).result
      handleUpgrade(db, storeName)
    }

    request.onsuccess = (event) => {
      const db = (
        event.target as IDBOpenDBRequest
      ).result
      const names = db.objectStoreNames
      for (let i = 0; i < names.length; i++) {
        knownStores.add(names[i])
      }
      resolve(db)
    }

    request.onerror = () => resolve(null)
    request.onblocked = () => resolve(null)
  })
}
