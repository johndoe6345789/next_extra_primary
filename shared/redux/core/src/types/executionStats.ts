/**
 * Execution tracking, metrics, and statistics
 */

import type { ExecutionResult } from
  './workflowExecution';

/** Execution state enum */
export type ExecutionState =
  | 'idle' | 'running' | 'paused'
  | 'completed' | 'failed' | 'cancelled';

/** Execution record */
export interface ExecutionRecord {
  id: string;
  workflowId: string;
  state: ExecutionState;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  metrics?: ExecutionMetrics;
}

/** Execution metrics */
export interface ExecutionMetrics {
  duration?: number;
  nodesExecuted?: number;
  totalNodes?: number;
}

/** Execution status for workflow runs */
export type ExecutionStatus =
  | 'pending' | 'running' | 'success'
  | 'error' | 'stopped';

/** Aggregated execution statistics */
export interface ExecutionStats {
  totalExecutions: number;
  successfulExecutions?: number;
  failedExecutions?: number;
  successCount?: number;
  errorCount?: number;
  averageDuration: number;
  lastExecution?: ExecutionResult;
  lastExecutionTime?: number;
}
