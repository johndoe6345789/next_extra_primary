/**
 * Multi-store IndexedDB open/close logic
 */

import type {
  MultiStoreConfig, IndexedDBService,
} from './indexedDBTypes';
import { createIndexedDBService } from
  './indexedDBFactory';

/** Open a multi-store IndexedDB database */
export function createMultiStoreOpen(
  config: MultiStoreConfig,
  dbRef: { current: IDBDatabase | null }
): () => Promise<IDBDatabase> {
  return async () => {
    if (dbRef.current) return dbRef.current;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(
        config.dbName, config.dbVersion
      );
      req.onerror = () => reject(req.error);
      req.onupgradeneeded = (e) => {
        const d = (e.target as
          IDBOpenDBRequest).result;
        for (const s of config.stores) {
          if (d.objectStoreNames.contains(s.name))
            continue;
          const os = d.createObjectStore(
            s.name, { keyPath: s.keyPath });
          for (const ix of s.indexes ?? [])
            os.createIndex(ix.name, ix.keyPath,
              { unique: ix.unique ?? false });
        }
      };
      req.onsuccess = () => {
        dbRef.current = req.result;
        resolve(dbRef.current);
      };
    });
  };
}

/** Get or create a store service */
export function getOrCreateStore<
  T extends Record<string, unknown>
>(
  config: MultiStoreConfig,
  svcMap: Map<string, IndexedDBService<
    Record<string, unknown>
  >>,
  storeName: string
): IndexedDBService<T> {
  const sc = config.stores.find(
    (s) => s.name === storeName
  );
  if (!sc) {
    throw new Error(
      `Store "${storeName}" not configured`
    );
  }
  if (!svcMap.has(storeName)) {
    svcMap.set(
      storeName, createIndexedDBService({
        dbName: config.dbName,
        dbVersion: config.dbVersion,
        storeName,
        keyPath: sc.keyPath,
        indexes: sc.indexes,
      })
    );
  }
  return svcMap.get(storeName) as
    IndexedDBService<T>;
}
