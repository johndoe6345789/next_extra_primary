'use client'

/**
 * List-type KV operations
 */

import type { DBALClientConfig } from './types'
import { createKVListReadOps } from './kvStoreListReadOps'
import { createKVListWriteOps } from './kvStoreListWrite'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create list-type KV callbacks */
export function createKVListOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const { listGet, listLength } =
    createKVListReadOps(config, withState)

  const { listAdd, listRemove, listClear } =
    createKVListWriteOps(config, withState)

  return {
    listAdd,
    listGet,
    listRemove,
    listLength,
    listClear,
  }
}
