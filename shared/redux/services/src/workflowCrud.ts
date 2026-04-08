/**
 * Workflow CRUD operations (offline-first)
 * Create, save, and delete operations
 */

import type { Workflow } from '../types/workflow'
import { api } from './api'
import { db } from '../db/schema'

export {
  getWorkflow,
  fetchFromBackend,
  listWorkflows,
} from './workflowFetch'

/** @brief Create a new workflow locally */
export async function createWorkflow(data: {
  name: string
  description?: string
  tenantId: string
}): Promise<Workflow> {
  const now = Date.now()
  const wf: Workflow = {
    id: `workflow-${now}`,
    name: data.name,
    description: data.description || '',
    version: '1.0.0',
    tenantId: data.tenantId,
    nodes: [],
    connections: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
  }
  await db.workflows.add(wf)
  await db.syncQueue.add({
    id: undefined,
    tenantId: data.tenantId,
    action: 'create',
    entity: 'workflow',
    entityId: wf.id,
    data: wf,
    timestamp: now,
    retries: 0,
  })
  return wf
}

/** @brief Save workflow to IndexedDB */
export async function saveWorkflow(
  wf: Workflow
): Promise<void> {
  wf.updatedAt = Date.now()
  await db.workflows.put(wf)
  await db.syncQueue.add({
    id: undefined,
    tenantId: wf.tenantId,
    action: 'update',
    entity: 'workflow',
    entityId: wf.id,
    data: wf,
    timestamp: Date.now(),
    retries: 0,
  })
}

/** @brief Delete workflow */
export async function deleteWorkflow(
  wfId: string,
  tenantId = 'default'
): Promise<void> {
  await api.workflows.delete(wfId)
  await db.workflows.delete(wfId)
  await db.syncQueue.add({
    id: undefined,
    tenantId,
    action: 'delete',
    entity: 'workflow',
    entityId: wfId,
    data: null,
    timestamp: Date.now(),
    retries: 0,
  })
}
