/**
 * OfflineStore connection lifecycle
 */

import {
  isIDBAvailable,
  openInternal,
} from './indexedDBConnection'

/** Manage DB singleton connection state */
export class DBLifecycle {
  db: IDBDatabase | null = null
  dbPromise: Promise<
    IDBDatabase | null
  > | null = null
  knownStores = new Set<string>()

  /** Close the database connection */
  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
  }

  /** Open DB, ensuring the store exists */
  async open(
    storeName?: string
  ): Promise<IDBDatabase | null> {
    if (!isIDBAvailable()) return null
    if (
      this.db &&
      (!storeName ||
        this.knownStores.has(storeName))
    ) {
      return this.db
    }
    if (this.dbPromise) {
      await this.dbPromise
      if (
        this.db &&
        (!storeName ||
          this.knownStores.has(storeName))
      ) {
        return this.db
      }
    }
    this.dbPromise = this.openImpl(storeName)
    const db = await this.dbPromise
    this.dbPromise = null
    return db
  }

  private async openImpl(
    storeName?: string
  ): Promise<IDBDatabase | null> {
    const db = await openInternal(
      this.knownStores,
      this.db,
      storeName
    )
    if (db) {
      this.db = db
      db.onversionchange = () => {
        db.close()
        this.db = null
      }
    } else {
      this.db = null
    }
    return db
  }
}
