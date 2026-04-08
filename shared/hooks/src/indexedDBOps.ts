/**
 * OfflineStore CRUD delegators
 * Composes read and write operations.
 */

import type { DBLifecycle } from './indexedDBLifecycle'
import { createReadOps } from './indexedDBReadOps'
import { createWriteOps } from './indexedDBWriteOps'

/** CRUD operations delegating to lifecycle */
export function createCrudOps(lc: DBLifecycle) {
  const { getAll, get } = createReadOps(lc)
  const { put, putMany, del, clear, count } =
    createWriteOps(lc)
  return { getAll, get, put, putMany, del, clear, count }
}
