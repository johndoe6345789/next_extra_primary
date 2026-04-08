'use client'

/**
 * Mutation execution for offline sync
 */

import type {
  DBALClientConfig,
  SyncQueueEntry,
} from './types'
import { OfflineStore } from './useIndexedDB'

export { checkApiHealth } from './offlineSyncHealth'

/** Build URL and method for a mutation */
function buildRequest(
  cfg: DBALClientConfig,
  entity: string,
  operation: SyncQueueEntry['operation'],
  data: Record<string, unknown>
) {
  const base = cfg.baseUrl ?? ''
  const tenant = cfg.tenant ?? ''
  const pkg = cfg.packageId ?? ''
  const prefix = `${base}/api/v1/${tenant}/${pkg}/${entity}`

  switch (operation) {
    case 'create':
      return { method: 'POST', url: prefix, body: JSON.stringify(data) }
    case 'update':
      return {
        method: 'PUT',
        url: `${prefix}/${data.id as string}`,
        body: JSON.stringify(data),
      }
    case 'delete':
      return {
        method: 'DELETE',
        url: `${prefix}/${data.id as string}`,
        body: undefined,
      }
  }
}

/**
 * Execute a single queued mutation against
 * the REST API and update local IndexedDB.
 */
export async function executeMutation(
  cfg: DBALClientConfig,
  entity: string,
  operation: SyncQueueEntry['operation'],
  data: Record<string, unknown>
): Promise<unknown> {
  const { method, url, body } = buildRequest(
    cfg, entity, operation, data
  )
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...cfg.headers,
  }
  const res = await fetch(url, {
    method, headers, body,
  })
  if (!res.ok) {
    throw new Error(
      `Sync failed: HTTP ${res.status}`
    )
  }

  const result = await res.json()
  const store = OfflineStore.getInstance()

  if (operation !== 'delete' && result?.data) {
    await store.put(entity, {
      ...result.data,
      id: (result.data.id as string) ??
        (data.id as string),
      _syncStatus: 'synced',
    })
  } else if (operation === 'delete') {
    await store.delete(
      entity, data.id as string
    )
  }
  return result
}
