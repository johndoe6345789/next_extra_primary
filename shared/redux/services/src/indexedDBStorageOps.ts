/**
 * IndexedDB storage transaction helpers
 */

/** Run a read transaction on a store */
export function idbRead<T>(
  db: IDBDatabase,
  storeName: string,
  op: (store: IDBObjectStore) => IDBRequest
): Promise<T> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      storeName, 'readonly'
    );
    const store = tx.objectStore(storeName);
    const req = op(store);
    req.onsuccess = () =>
      resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

/** Run a write transaction on a store */
export function idbWrite(
  db: IDBDatabase,
  storeName: string,
  op: (store: IDBObjectStore) => IDBRequest
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(
      storeName, 'readwrite'
    );
    const store = tx.objectStore(storeName);
    const req = op(store);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
