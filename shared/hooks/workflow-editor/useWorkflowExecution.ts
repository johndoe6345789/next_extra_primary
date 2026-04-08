/**
 * useWorkflowExecution Hook
 * Manages execution state and history
 */

import type {
  UseWorkflowExecutionReturn,
  UseWorkflowExecutionOptions,
} from './workflowExecutionTypes';
import {
  useExecutionLifecycle,
} from './workflowExecutionLifecycle';
import {
  useExecutionState,
} from './workflowExecutionState';

export type {
  UseWorkflowExecutionReturn,
  UseWorkflowExecutionOptions,
} from './workflowExecutionTypes';

/** Hook for workflow execution state */
export function useWorkflowExecution(
  opts: UseWorkflowExecutionOptions = {}
): UseWorkflowExecutionReturn {
  const {
    maxHistorySize = 50,
    onExecutionStart,
    onExecutionComplete,
    onExecutionError,
  } = opts;

  const s = useExecutionState(maxHistorySize);

  const lifecycle = useExecutionLifecycle(
    s.currentExecution,
    s.setCurrent,
    s.setIsExecuting,
    s.addToHistory,
    onExecutionStart,
    onExecutionComplete,
    onExecutionError
  );

  return {
    isExecuting: s.isExecuting,
    currentExecution: s.currentExecution,
    executionHistory: s.executionHistory,
    nodeExecutionStates: s.nodeExecutionStates,
    ...lifecycle,
    setNodeState: s.setNodeState,
    clearNodeStates: s.clearNodeStates,
    clearHistory: s.clearHistory,
    getExecutionById: s.getExecutionById,
  };
}
