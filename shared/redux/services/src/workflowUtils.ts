/**
 * Workflow utility operations
 * Sync and validation
 */

import type { Workflow } from '../types/workflow';
import { api } from './api';
import { db } from '../db/schema';

export { getWorkflowMetrics } from
  './workflowMetrics';
export {
  exportWorkflow, importWorkflow,
  duplicateWorkflow,
} from './workflowImportExport';

/** Sync workflow to backend */
export async function syncToBackend(
  workflow: Workflow
): Promise<Workflow> {
  if (workflow.id.startsWith('workflow-')) {
    const result = await api.workflows.create(
      workflow
    );
    await db.workflows.put(result);
    return result;
  }
  const result = await api.workflows.update(
    workflow.id, workflow
  );
  await db.workflows.put(result);
  const syncItems = await db.syncQueue
    .where('[tenantId+action]')
    .equals([workflow.tenantId, 'update'])
    .toArray();
  for (const item of syncItems) {
    if (item.entityId === workflow.id) {
      await db.syncQueue.update(
        item.id, { retries: 0 }
      );
    }
  }
  return result;
}

/** Validate workflow before execution */
export async function validateWorkflow(
  workflowId: string, workflow: Workflow
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  return api.workflows.validate(workflowId, {
    nodes: workflow.nodes,
    connections: workflow.connections,
  });
}
