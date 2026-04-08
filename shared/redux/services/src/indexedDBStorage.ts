/**
 * IndexedDB-backed key-value storage backend
 */

import type {
  StorageBackend, IndexedDBStorageConfig,
} from './storageTypes';
import {
  DEFAULT_DB_NAME, DEFAULT_DB_VERSION,
  DEFAULT_STORE_NAME,
} from './storageTypes';
import { idbWrite } from './indexedDBStorageOps';
import {
  storageGet, storageKeys,
} from './indexedDBStorageRead';

/** IndexedDB key-value storage */
export class IndexedDBStorage
  implements StorageBackend {
  private dbPromise: Promise<IDBDatabase>;
  private storeName: string;

  constructor(config: IndexedDBStorageConfig = {}) {
    const dn = config.dbName || DEFAULT_DB_NAME;
    this.storeName =
      config.storeName || DEFAULT_STORE_NAME;
    const ver =
      config.dbVersion || DEFAULT_DB_VERSION;
    const sn = this.storeName;
    this.dbPromise = new Promise((res, rej) => {
      const req = indexedDB.open(dn, ver);
      req.onerror = () => rej(req.error);
      req.onsuccess = () => res(req.result);
      req.onupgradeneeded = (e) => {
        const db = (e.target as
          IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(sn))
          db.createObjectStore(sn);
      };
    });
  }

  async get<T>(key: string) {
    return storageGet<T>(
      this.dbPromise, this.storeName, key
    );
  }

  async set(key: string, value: unknown) {
    const db = await this.dbPromise;
    return idbWrite(
      db, this.storeName,
      (s) => s.put(value, key)
    );
  }

  async delete(key: string) {
    const db = await this.dbPromise;
    return idbWrite(
      db, this.storeName,
      (s) => s.delete(key)
    );
  }

  async keys() {
    return storageKeys(
      this.dbPromise, this.storeName
    );
  }

  async clear() {
    const db = await this.dbPromise;
    return idbWrite(
      db, this.storeName,
      (s) => s.clear()
    );
  }
}
