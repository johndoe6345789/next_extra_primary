/**
 * Execution lifecycle callbacks
 */

import { useCallback } from 'react';
import type {
  ExecutionResult,
} from '../../types/workflow-editor';

/** Create execution lifecycle callbacks */
export function useExecutionLifecycle(
  currentExecution: ExecutionResult | null,
  setCurrent: (e: ExecutionResult | null) => void,
  setIsExecuting: (v: boolean) => void,
  addToHistory: (r: ExecutionResult) => void,
  onStart?: (id: string) => void,
  onComplete?: (r: ExecutionResult) => void,
  onError?: (err: string) => void
) {
  const startExecution = useCallback(
    (wfId: string) => {
      const exec: ExecutionResult = {
        id: `exec_${Date.now()}`,
        workflowId: wfId,
        status: 'running',
        startedAt: Date.now(),
        nodeResults: {},
      };
      setCurrent(exec);
      setIsExecuting(true);
      onStart?.(wfId);
    },
    [setCurrent, setIsExecuting, onStart]
  );

  const completeExecution = useCallback(
    (result: ExecutionResult) => {
      const final: ExecutionResult = {
        ...result, status: 'completed',
        completedAt: Date.now(),
      };
      setCurrent(null);
      setIsExecuting(false);
      addToHistory(final);
      onComplete?.(final);
    },
    [setCurrent, setIsExecuting, addToHistory, onComplete]
  );

  const failExecution = useCallback(
    (error: string) => {
      if (currentExecution) {
        const failed: ExecutionResult = {
          ...currentExecution,
          status: 'failed',
          error,
          completedAt: Date.now(),
        };
        setCurrent(null);
        setIsExecuting(false);
        addToHistory(failed);
        onError?.(error);
      }
    },
    [currentExecution, setCurrent, setIsExecuting, addToHistory, onError]
  );

  const cancelExecution = useCallback(() => {
    if (currentExecution) {
      const cancelled: ExecutionResult = {
        ...currentExecution,
        status: 'cancelled',
        completedAt: Date.now(),
      };
      setCurrent(null);
      setIsExecuting(false);
      addToHistory(cancelled);
    }
  }, [currentExecution, setCurrent, setIsExecuting, addToHistory]);

  return {
    startExecution,
    completeExecution,
    failExecution,
    cancelExecution,
  };
}
