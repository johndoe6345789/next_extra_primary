/**
 * Multi-store IndexedDB bulk operations
 */

import type {
  IndexedDBService,
} from './indexedDBTypes';

/** Store config descriptor */
interface StoreConfig {
  name: string;
  keyPath: string;
  indexes?: Array<{
    name: string;
    keyPath: string;
    unique?: boolean;
  }>;
}

/** Clear all stores in a database */
export async function clearAllStores(
  open: () => Promise<IDBDatabase>,
  stores: StoreConfig[]
): Promise<void> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const names = stores.map((s) => s.name);
    const tx = db.transaction(
      names, 'readwrite'
    );
    for (const n of names) {
      tx.objectStore(n).clear();
    }
    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => resolve();
  });
}

/** Export all data from stores */
export async function exportAllStores(
  stores: StoreConfig[],
  getStore: <T extends Record<string, unknown>>(
    name: string
  ) => IndexedDBService<T>
): Promise<Record<string, unknown[]>> {
  const result: Record<string, unknown[]> = {};
  for (const s of stores) {
    const svc = getStore(s.name);
    result[s.name] = await svc.getAll();
  }
  return result;
}

/** Import data into all stores */
export async function importAllStores(
  data: Record<string, unknown[]>,
  stores: StoreConfig[],
  clearAll: () => Promise<void>,
  getStore: <T extends Record<string, unknown>>(
    name: string
  ) => IndexedDBService<T>
): Promise<void> {
  await clearAll();
  for (const [name, items] of
    Object.entries(data)) {
    const sc = stores.find(
      (s) => s.name === name
    );
    if (sc && items.length > 0) {
      const svc = getStore(name);
      await svc.importData(
        items as Record<string, unknown>[],
        false
      );
    }
  }
}
