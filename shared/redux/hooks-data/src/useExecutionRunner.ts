/**
 * Execution runner operations hook
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useServices } from '@shared/service-adapters';
import {
  startExecution, endExecution,
} from '@shared/redux-slices';
import type { ExecutionResult } from
  '@shared/types';
import type { AppDispatch } from
  '@shared/redux-slices';

/** Execute and cancel workflows */
export function useExecutionRunner(
  currentExecution: ExecutionResult | null
) {
  const dispatch = useDispatch<AppDispatch>();
  const { executionService } = useServices();

  /** Execute a workflow */
  const execute = useCallback(async (
    workflowId: string,
    inputs?: Record<string, unknown>,
    tenantId = 'default'
  ): Promise<ExecutionResult> => {
    try {
      const rand = Math.random()
        .toString(36).substr(2, 9);
      const payload: ExecutionResult = {
        id: `exec-${Date.now()}-${rand}`,
        workflowId,
        workflowName: 'Executing...',
        status: 'running',
        startTime: Date.now(),
        endTime: undefined,
        nodes: [],
        output: undefined,
        error: undefined,
        tenantId,
      };
      dispatch(startExecution(payload));
      const result = await executionService
        .executeWorkflow(workflowId, {
          nodes: [], connections: [],
          inputs: inputs || {},
        }, tenantId);
      dispatch(endExecution(result));
      return result;
    } catch (e) {
      const msg = e instanceof Error
        ? e.message : 'Execution failed';
      throw new Error(msg);
    }
  }, [dispatch, executionService]);

  /** Cancel currently running execution */
  const stop = useCallback(async () => {
    try {
      if (!currentExecution?.id)
        throw new Error('No execution running');
      await executionService.cancelExecution(
        currentExecution.id);
      dispatch(endExecution({
        ...currentExecution,
        status: 'cancelled',
        endTime: Date.now(),
      }));
    } catch (e) {
      const msg = e instanceof Error
        ? e.message
        : 'Failed to cancel execution';
      throw new Error(msg);
    }
  }, [currentExecution, dispatch,
    executionService]);

  return { execute, stop };
}
