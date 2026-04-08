/**
 * CRUD operations for OfflineStore
 * Re-exports from split operation files.
 */

export { transact, getAllRecords } from './indexedDBRead'
export { putManyRecords, countRecords } from './indexedDBWrite'
