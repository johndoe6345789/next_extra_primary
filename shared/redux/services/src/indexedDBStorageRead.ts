/**
 * IndexedDB storage read operations
 */

import { idbRead } from './indexedDBStorageOps';

/** Read a value from IndexedDB storage */
export async function storageGet<T>(
  dbPromise: Promise<IDBDatabase>,
  storeName: string,
  key: string
): Promise<T | undefined> {
  try {
    const db = await dbPromise;
    return idbRead<T>(
      db, storeName,
      (s) => s.get(key)
    );
  } catch (err) {
    console.error('IndexedDB get:', err);
    return undefined;
  }
}

/** Read all keys from IndexedDB storage */
export async function storageKeys(
  dbPromise: Promise<IDBDatabase>,
  storeName: string
): Promise<string[]> {
  try {
    const db = await dbPromise;
    return idbRead<string[]>(
      db, storeName,
      (s) => s.getAllKeys()
    );
  } catch (err) {
    console.error('IndexedDB keys:', err);
    return [];
  }
}
