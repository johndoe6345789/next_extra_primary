/**
 * REST API storage backend with fallback
 */

import type {
  StorageBackend, RESTAPIStorageConfig,
} from './storageTypes';
import { IndexedDBStorage } from
  './indexedDBStorage';
import { restGet, restKeys } from
  './restAPIStorageRead';
import {
  restSet, restDelete, restClear,
} from './restAPIStorageWrite';

/** REST API storage with IndexedDB fallback */
export class RESTAPIStorage
  implements StorageBackend {
  private baseURL: string;
  private fallback: IndexedDBStorage | null;

  constructor(config: RESTAPIStorageConfig) {
    this.baseURL =
      config.baseURL.replace(/\/$/, '');
    this.fallback =
      config.fallbackToIndexedDB !== false
        ? new IndexedDBStorage(
          config.indexedDBConfig
        ) : null;
  }

  async get<T>(key: string) {
    return restGet<T>(
      this.baseURL, key, this.fallback
    );
  }

  async set(key: string, val: unknown) {
    return restSet(
      this.baseURL, key, val, this.fallback
    );
  }

  async delete(key: string) {
    return restDelete(
      this.baseURL, key, this.fallback
    );
  }

  async keys() {
    return restKeys(
      this.baseURL, this.fallback
    );
  }

  async clear() {
    return restClear(
      this.baseURL, this.fallback
    );
  }
}
