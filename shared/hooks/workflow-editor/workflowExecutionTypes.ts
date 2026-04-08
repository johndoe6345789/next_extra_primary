/**
 * Types for useWorkflowExecution
 */

import type {
  ExecutionResult,
  ExecutionState,
} from '../../types/workflow-editor';

/** Return type of useWorkflowExecution */
export interface UseWorkflowExecutionReturn {
  isExecuting: boolean;
  currentExecution: ExecutionResult | null;
  executionHistory: ExecutionResult[];
  nodeExecutionStates: Record<
    string,
    ExecutionState
  >;
  startExecution: (workflowId: string) => void;
  completeExecution: (
    result: ExecutionResult
  ) => void;
  failExecution: (error: string) => void;
  cancelExecution: () => void;
  setNodeState: (
    nodeId: string,
    state: ExecutionState
  ) => void;
  clearNodeStates: () => void;
  clearHistory: () => void;
  getExecutionById: (
    id: string
  ) => ExecutionResult | undefined;
}

/** Options for useWorkflowExecution */
export interface UseWorkflowExecutionOptions {
  maxHistorySize?: number;
  onExecutionStart?: (
    workflowId: string
  ) => void;
  onExecutionComplete?: (
    result: ExecutionResult
  ) => void;
  onExecutionError?: (error: string) => void;
}
