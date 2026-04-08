'use client'

/**
 * Batch and query KV operations
 * Composes from split files.
 */

import type { DBALClientConfig } from './types'
import { createKVMgetOps } from './kvStoreBatchMget'
import { createKVQueryOps } from './kvStoreBatchQuery'

type WithState = <R>(
  fn: () => Promise<R>
) => Promise<R>

/** Create batch + query KV callbacks */
export function createKVBatchOps(
  config: DBALClientConfig,
  withState: WithState
) {
  const { mget, mset } = createKVMgetOps(config, withState)
  const { list, count, clear } = createKVQueryOps(config, withState)
  return { mget, mset, list, count, clear }
}
