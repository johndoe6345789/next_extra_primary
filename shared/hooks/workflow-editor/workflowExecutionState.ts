/**
 * Execution state and utility callbacks
 */

import { useState, useCallback } from 'react';
import type {
  ExecutionResult,
  ExecutionState,
} from '../../types/workflow-editor';

/** Initialize execution state hooks */
export function useExecutionState(
  maxHistorySize: number
) {
  const [isExecuting, setIsExecuting] =
    useState(false);
  const [currentExecution, setCurrent] =
    useState<ExecutionResult | null>(null);
  const [executionHistory, setHistory] =
    useState<ExecutionResult[]>([]);
  const [nodeExecutionStates, setNodeStates] =
    useState<
      Record<string, ExecutionState>
    >({});

  const addToHistory = useCallback(
    (r: ExecutionResult) => {
      setHistory((prev) =>
        [r, ...prev].slice(0, maxHistorySize)
      );
    },
    [maxHistorySize]
  );

  const setNodeState = useCallback(
    (id: string, state: ExecutionState) =>
      setNodeStates((p) => ({
        ...p,
        [id]: state,
      })),
    []
  );
  const clearNodeStates = useCallback(
    () => setNodeStates({}),
    []
  );
  const clearHistory = useCallback(
    () => setHistory([]),
    []
  );
  const getExecutionById = useCallback(
    (id: string) =>
      executionHistory.find(
        (e) => e.id === id
      ),
    [executionHistory]
  );

  return {
    isExecuting, currentExecution,
    executionHistory, nodeExecutionStates,
    setIsExecuting, setCurrent, addToHistory,
    setNodeState, clearNodeStates,
    clearHistory, getExecutionById,
  };
}
