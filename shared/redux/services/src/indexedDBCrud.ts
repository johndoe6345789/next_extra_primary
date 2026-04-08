/**
 * IndexedDB CRUD operation helpers
 * Used internally by createIndexedDBService
 */

/** Run a readonly transaction and return result */
export function readStore<T>(
  db: IDBDatabase,
  storeName: string,
  fn: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      [storeName], 'readonly'
    );
    const store = tx.objectStore(storeName);
    const req = fn(store);
    req.onerror = () => reject(req.error);
    req.onsuccess = () =>
      resolve(req.result as T);
  });
}

/** Run a readwrite transaction */
export function writeStore(
  db: IDBDatabase,
  storeName: string,
  fn: (store: IDBObjectStore) => IDBRequest
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      [storeName], 'readwrite'
    );
    const store = tx.objectStore(storeName);
    const req = fn(store);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
  });
}

/** Read from an index */
export function readIndex<T>(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  value: IDBValidKey
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      [storeName], 'readonly'
    );
    const store = tx.objectStore(storeName);
    const idx = store.index(indexName);
    const req = idx.getAll(value);
    req.onerror = () => reject(req.error);
    req.onsuccess = () =>
      resolve(req.result as T[]);
  });
}

/** Import multiple items in one transaction */
export function importItems<
  T extends Record<string, unknown>
>(
  db: IDBDatabase,
  storeName: string,
  items: T[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      [storeName], 'readwrite'
    );
    const store = tx.objectStore(storeName);
    for (const item of items) {
      store.add(item);
    }
    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => resolve();
  });
}
