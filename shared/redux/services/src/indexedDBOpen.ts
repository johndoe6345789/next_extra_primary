/**
 * IndexedDB database open helper
 */

import type { IndexedDBConfig } from
  './indexedDBTypes';

/** Open an IndexedDB database with config */
export function openDB(
  config: IndexedDBConfig,
  dbRef: { current: IDBDatabase | null }
): Promise<IDBDatabase> {
  if (dbRef.current) {
    return Promise.resolve(dbRef.current);
  }
  const {
    dbName, dbVersion, storeName,
    keyPath, indexes = [],
  } = config;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(
      dbName, dbVersion
    );
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = (e) => {
      const db =
        (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(
        storeName
      )) {
        const s = db.createObjectStore(
          storeName, { keyPath }
        );
        for (const ix of indexes) {
          s.createIndex(
            ix.name, ix.keyPath,
            { unique: ix.unique ?? false }
          );
        }
      }
    };
    req.onsuccess = () => {
      dbRef.current = req.result;
      resolve(dbRef.current);
    };
  });
}
