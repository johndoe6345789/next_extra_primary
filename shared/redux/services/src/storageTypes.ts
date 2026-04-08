/**
 * Storage service type definitions
 */

/** Storage backend interface */
export interface StorageBackend {
  get<T>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  keys(): Promise<string[]>;
  clear(): Promise<void>;
}

/** IndexedDB storage configuration */
export interface IndexedDBStorageConfig {
  dbName?: string;
  dbVersion?: number;
  storeName?: string;
}

/** REST API storage configuration */
export interface RESTAPIStorageConfig {
  baseURL: string;
  fallbackToIndexedDB?: boolean;
  indexedDBConfig?: IndexedDBStorageConfig;
}

/** Overall storage configuration */
export interface StorageServiceConfig {
  useRestAPI?: boolean;
  restAPIURL?: string;
  indexedDBConfig?: IndexedDBStorageConfig;
}

/** Default storage constants */
export const DEFAULT_DB_NAME =
  'metabuilder-storage';
export const DEFAULT_DB_VERSION = 1;
export const DEFAULT_STORE_NAME = 'kv-store';
