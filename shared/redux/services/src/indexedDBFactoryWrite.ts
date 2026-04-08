/**
 * IndexedDB write operation builders
 */

import type { IndexedDBService } from
  './indexedDBTypes';
import {
  writeStore, importItems,
} from './indexedDBCrud';

/** Build write operations for a store */
export function buildWriteOps<
  T extends Record<string, unknown>
>(
  open: () => Promise<IDBDatabase>,
  sn: string
): Pick<
  IndexedDBService<T>,
  'create' | 'update' | 'delete' | 'clear' |
  'importData'
> {
  return {
    create: async (item) => {
      const db = await open();
      return writeStore(
        db, sn, (s) => s.add(item)
      );
    },
    update: async (item) => {
      const db = await open();
      return writeStore(
        db, sn, (s) => s.put(item)
      );
    },
    delete: async (id) => {
      const db = await open();
      return writeStore(
        db, sn, (s) => s.delete(id)
      );
    },
    clear: async () => {
      const db = await open();
      return writeStore(
        db, sn, (s) => s.clear()
      );
    },
    importData: async (
      items, clearFirst = true
    ) => {
      if (clearFirst) {
        const db = await open();
        await writeStore(
          db, sn, (s) => s.clear()
        );
      }
      const db = await open();
      return importItems(db, sn, items);
    },
  };
}
