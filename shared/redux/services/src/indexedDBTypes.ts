/**
 * IndexedDB service type definitions
 */

/** Index definition for IndexedDB stores */
export interface IndexedDBIndex {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
}

/** Configuration for a single-store service */
export interface IndexedDBConfig {
  dbName: string;
  dbVersion: number;
  storeName: string;
  keyPath: string;
  indexes?: IndexedDBIndex[];
}

/** CRUD operations for a typed store */
export interface IndexedDBService<
  T extends Record<string, unknown>
> {
  open(): Promise<IDBDatabase>;
  close(): void;
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  getByIndex(
    indexName: string,
    value: IDBValidKey
  ): Promise<T[]>;
  create(item: T): Promise<void>;
  update(item: T): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
  count(): Promise<number>;
  exportData(): Promise<T[]>;
  importData(
    items: T[], clearFirst?: boolean
  ): Promise<void>;
}

/** Config for multi-store IndexedDB service */
export interface MultiStoreConfig {
  dbName: string;
  dbVersion: number;
  stores: Array<{
    name: string;
    keyPath: string;
    indexes?: IndexedDBIndex[];
  }>;
}

/** Multi-store service interface */
export interface MultiStoreService {
  open(): Promise<IDBDatabase>;
  close(): void;
  getStore<T extends Record<string, unknown>>(
    storeName: string
  ): IndexedDBService<T>;
  clearAll(): Promise<void>;
  exportAll(): Promise<
    Record<string, unknown[]>
  >;
  importAll(
    data: Record<string, unknown[]>
  ): Promise<void>;
}
