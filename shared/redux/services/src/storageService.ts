/**
 * Storage Service - barrel and factory
 */

export type {
  StorageBackend, IndexedDBStorageConfig,
  RESTAPIStorageConfig, StorageServiceConfig,
} from './storageTypes';

export { IndexedDBStorage } from
  './indexedDBStorage';
export { RESTAPIStorage } from
  './restAPIStorage';

import type { StorageBackend } from
  './storageTypes';
import type { StorageServiceConfig } from
  './storageTypes';
import { IndexedDBStorage } from
  './indexedDBStorage';
import { RESTAPIStorage } from
  './restAPIStorage';

/** Create a storage service from config */
export function createStorageService(
  config: StorageServiceConfig = {}
): StorageBackend {
  if (config.useRestAPI && config.restAPIURL) {
    return new RESTAPIStorage({
      baseURL: config.restAPIURL,
      fallbackToIndexedDB: true,
      indexedDBConfig: config.indexedDBConfig,
    });
  }
  return new IndexedDBStorage(
    config.indexedDBConfig
  );
}

let defaultInstance: StorageBackend | null = null;

/** Get the default storage instance */
export function getDefaultStorage(
): StorageBackend {
  if (!defaultInstance) {
    defaultInstance = new IndexedDBStorage();
  }
  return defaultInstance;
}

/** Configure and replace the default storage */
export function configureDefaultStorage(
  config: StorageServiceConfig
): StorageBackend {
  defaultInstance = createStorageService(config);
  return defaultInstance;
}
