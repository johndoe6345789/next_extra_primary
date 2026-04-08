/**
 * Factory for creating single-store IndexedDB
 */

import type {
  IndexedDBConfig, IndexedDBService,
} from './indexedDBTypes';
import { readStore, readIndex } from
  './indexedDBCrud';
import { openDB } from './indexedDBOpen';
import { buildWriteOps } from
  './indexedDBFactoryWrite';

/** Create a typed IndexedDB service */
export function createIndexedDBService<
  T extends Record<string, unknown>
>(config: IndexedDBConfig): IndexedDBService<T> {
  const dbRef: { current: IDBDatabase | null } =
    { current: null };
  const sn = config.storeName;
  const open = () => openDB(config, dbRef);
  const close = () => {
    if (dbRef.current) {
      dbRef.current.close();
      dbRef.current = null;
    }
  };

  const writeOps = buildWriteOps<T>(open, sn);

  return {
    open, close,
    getAll: async () => {
      const db = await open();
      return readStore<T[]>(
        db, sn, (s) => s.getAll()
      );
    },
    getById: async (id) => {
      const db = await open();
      return readStore<T | null>(
        db, sn, (s) => s.get(id)
      ).then((r) => r || null);
    },
    getByIndex: async (ix, val) => {
      const db = await open();
      return readIndex<T>(db, sn, ix, val);
    },
    count: async () => {
      const db = await open();
      return readStore<number>(
        db, sn, (s) => s.count()
      );
    },
    exportData: async () => {
      const db = await open();
      return readStore<T[]>(
        db, sn, (s) => s.getAll()
      );
    },
    ...writeOps,
  };
}
