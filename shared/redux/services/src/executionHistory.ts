/**
 * Execution history queries
 */

import { api } from './api';
import { db } from '../db/schema';
import type { ExecutionResult } from
  '../types/workflow';

export {
  getExecutionStats, clearExecutionHistory,
} from './executionStats';

/** Get execution history for a workflow */
export async function getExecutionHistory(
  workflowId: string,
  tenantId = 'default',
  limit = 50
): Promise<ExecutionResult[]> {
  try {
    const result = await api.executions
      .getHistory(workflowId, limit);
    if (
      db?.executions && Array.isArray(result)
    ) {
      for (const exec of result) {
        await db.executions.put({
          id: exec.id,
          workflowId, tenantId, ...exec,
        }).catch(() => {});
      }
    }
    return result;
  } catch {
    if (db?.executions) {
      return db.executions
        .where({ workflowId, tenantId })
        .reverse().limit(limit).toArray();
    }
    return [];
  }
}

/** Get execution details by ID */
export async function getExecutionDetails(
  executionId: string
): Promise<ExecutionResult | null> {
  try {
    const result = await api.executions
      .getById(executionId);
    if (db?.executions) {
      await db.executions.put(result)
        .catch(() => {});
    }
    return result;
  } catch {
    if (db?.executions) {
      return db.executions.get(executionId);
    }
    return null;
  }
}
