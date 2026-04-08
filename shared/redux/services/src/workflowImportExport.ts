/**
 * Workflow import, export, and duplication
 */

import type { Workflow } from '../types/workflow';
import { db } from '../db/schema';

/** Export workflow to JSON string */
export async function exportWorkflow(
  workflow: Workflow
): Promise<string> {
  return JSON.stringify(workflow, null, 2);
}

/** Import workflow from JSON */
export async function importWorkflow(
  json: string, tenantId: string
): Promise<Workflow> {
  try {
    const wf: Workflow = JSON.parse(json);
    wf.id = `workflow-${Date.now()}`;
    wf.tenantId = tenantId;
    wf.createdAt = Date.now();
    wf.updatedAt = Date.now();
    await db.workflows.add(wf);
    return wf;
  } catch {
    throw new Error('Invalid workflow JSON');
  }
}

/** Duplicate a workflow */
export async function duplicateWorkflow(
  workflowId: string, newName: string
): Promise<Workflow> {
  const original = await db.workflows.get(
    workflowId
  );
  if (!original) {
    throw new Error('Workflow not found');
  }
  const dup: Workflow = {
    ...original,
    id: `workflow-${Date.now()}`,
    name: newName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  await db.workflows.add(dup);
  return dup;
}
