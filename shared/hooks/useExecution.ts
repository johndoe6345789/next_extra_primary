/**
 * useExecution Hook
 * Manages workflow execution state and ops.
 */

import type {
  UseExecutionOptions,
} from './executionTypes';
import { useExecutionRun } from './executionRun';
import { useExecutionQuery } from './executionQuery';

export type {
  ExecutionResult,
  ExecutionStats,
  ExecutionService,
  ExecutionActions,
  UseExecutionOptions,
} from './executionTypes';

/** Hook for managing workflow execution */
export function useExecution(
  options: UseExecutionOptions
) {
  const {
    dispatch,
    currentExecution,
    executionHistory,
    executionService,
    actions,
  } = options;

  const { execute, stop } = useExecutionRun(
    dispatch, currentExecution,
    executionService, actions
  );
  const { getDetails, getStats, getHistory } =
    useExecutionQuery(executionService);

  return {
    currentExecution,
    executionHistory,
    execute,
    stop,
    getDetails,
    getStats,
    getHistory,
  };
}

export default useExecution;
