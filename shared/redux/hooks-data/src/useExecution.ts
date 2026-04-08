/**
 * useExecution Hook (Tier 2)
 * Manages workflow execution state
 *
 * @example
 * ```ts
 * const {
 *   execute, getHistory, currentExecution,
 * } = useExecution();
 * const result = await execute('wf-123');
 * ```
 */

import { useSelector } from 'react-redux';
import {
  selectCurrentExecution,
  selectExecutionHistory,
} from '@shared/redux-slices';
import type { RootState } from '@shared/redux-slices';
import { useExecutionRunner } from
  './useExecutionRunner';
import { useExecutionQueries } from
  './useExecutionQueries';

/** Execution state and operations hook */
export function useExecution() {
  const currentExecution = useSelector(
    (s: RootState) => selectCurrentExecution(s)
  );
  const executionHistory = useSelector(
    (s: RootState) => selectExecutionHistory(s)
  );

  const runner = useExecutionRunner(
    currentExecution
  );
  const queries = useExecutionQueries();

  return {
    currentExecution,
    executionHistory,
    ...runner,
    ...queries,
  };
}

export default useExecution;
