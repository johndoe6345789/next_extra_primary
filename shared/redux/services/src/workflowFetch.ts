/**
 * Workflow fetch and list operations
 * Offline-first with IndexedDB caching
 */

import type { Workflow } from '../types/workflow'
import { api } from './api'
import { db } from '../db/schema'

/** @brief Get workflow from IndexedDB */
export async function getWorkflow(
  workflowId: string
): Promise<Workflow | undefined> {
  try {
    return await db.workflows.get(workflowId)
  } catch {
    return undefined
  }
}

/** @brief Fetch from backend and cache */
export async function fetchFromBackend(
  workflowId: string
): Promise<Workflow> {
  const wf = await api.workflows.get(workflowId)
  await db.workflows.put(wf)
  return wf
}

/** @brief List workflows for a tenant */
export async function listWorkflows(
  tenantId: string
): Promise<Workflow[]> {
  try {
    const res = await api.workflows.list(
      tenantId
    )
    const wfs = res.workflows || []
    await Promise.all(
      wfs.map((w: Workflow) =>
        db.workflows.put(w)
      )
    )
    return wfs
  } catch {
    return db.workflows
      .where('tenantId')
      .equals(tenantId)
      .toArray()
  }
}
