/**
 * IndexedDB Service - barrel re-exports
 */

export type {
  IndexedDBIndex, IndexedDBConfig,
  IndexedDBService, MultiStoreConfig,
  MultiStoreService,
} from './indexedDBTypes';

export { createIndexedDBService } from
  './indexedDBFactory';

export { createMultiStoreService } from
  './indexedDBMultiStore';
