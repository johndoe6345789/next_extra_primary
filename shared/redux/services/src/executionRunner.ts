/**
 * Execution runner - execute workflows
 */

import { api } from './api'
import { db } from '../db/schema'
import type { ExecutionResult } from
  '../types/workflow'

export { cancelExecution } from './executionCancel'

/** @brief Execution request parameters */
export interface ExecutionRequest {
  nodes: unknown[]
  connections: unknown[]
  inputs?: Record<string, unknown>
}

/** @brief Execute a workflow */
export async function executeWorkflow(
  workflowId: string,
  data: ExecutionRequest,
  tenantId = 'default'
): Promise<ExecutionResult> {
  const execId = `exec-${Date.now()}-` +
    Math.random().toString(36).substr(2, 9)
  const exec: Partial<ExecutionResult> = {
    id: execId, workflowId,
    workflowName: 'Unknown',
    status: 'running',
    startTime: Date.now(),
    nodes: [], tenantId,
  }
  if (db?.executions) {
    await db.executions.add(
      exec as ExecutionResult
    )
  }
  try {
    const result = await api.executions.execute(
      workflowId, data
    )
    if (db?.executions) {
      await db.executions.update(execId, {
        status: result.status || 'success',
        endTime: Date.now(),
        output: result.output,
        error: result.error,
      })
    }
    return {
      id: execId, workflowId,
      workflowName: exec.workflowName || '',
      tenantId,
      status: (result.status || 'success') as
        ExecutionResult['status'],
      startTime: exec.startTime!,
      endTime: Date.now(),
      nodes: result.nodes || [],
      output: result.output,
      error: result.error,
    } as ExecutionResult
  } catch (backendErr) {
    if (db?.executions) {
      await db.executions.update(execId, {
        status: 'error',
        endTime: Date.now(),
        error: {
          code: 'BACKEND_ERROR',
          message:
            backendErr instanceof Error
              ? backendErr.message
              : 'Backend execution failed',
        },
      })
    }
    throw backendErr
  }
}
