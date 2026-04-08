/**
 * Multi-store IndexedDB service factory
 */

import type {
  MultiStoreConfig, MultiStoreService,
  IndexedDBService,
} from './indexedDBTypes';
import {
  clearAllStores, exportAllStores,
  importAllStores,
} from './indexedDBMultiOps';
import {
  createMultiStoreOpen, getOrCreateStore,
} from './indexedDBMultiOpen';

/** Create a multi-store IndexedDB service */
export function createMultiStoreService(
  config: MultiStoreConfig
): MultiStoreService {
  const dbRef: { current: IDBDatabase | null } =
    { current: null };
  const svcMap = new Map<
    string,
    IndexedDBService<Record<string, unknown>>
  >();

  const open = createMultiStoreOpen(config, dbRef);

  function close() {
    if (dbRef.current) {
      dbRef.current.close();
      dbRef.current = null;
    }
    svcMap.clear();
  }

  function getStore<
    T extends Record<string, unknown>
  >(storeName: string): IndexedDBService<T> {
    return getOrCreateStore<T>(
      config, svcMap, storeName
    );
  }

  const clearAll = () =>
    clearAllStores(open, config.stores);
  const exportAll = () =>
    exportAllStores(config.stores, getStore);
  const importAll = (
    data: Record<string, unknown[]>
  ) => importAllStores(
    data, config.stores, clearAll, getStore
  );

  return {
    open, close, getStore,
    clearAll, exportAll, importAll,
  };
}
