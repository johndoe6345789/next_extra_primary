/**
 * Execution start/stop callbacks
 */

import { useCallback } from 'react';
import type {
  ExecutionResult,
  ExecutionService,
  ExecutionActions,
} from './executionTypes';

/** Create execute and stop callbacks */
export function useExecutionRun(
  dispatch: (action: unknown) => void,
  currentExecution: ExecutionResult | null,
  executionService: ExecutionService,
  actions: ExecutionActions
) {
  const execute = useCallback(
    async (
      workflowId: string,
      inputs?: unknown,
      tenantId: string = 'default'
    ): Promise<ExecutionResult> => {
      try {
        const id =
          `exec-${Date.now()}-` +
          Math.random().toString(36).substr(2, 9);
        const startPayload: ExecutionResult = {
          id, workflowId,
          workflowName: 'Executing...',
          status: 'running',
          startTime: Date.now(),
          endTime: undefined, nodes: [],
          output: undefined, error: undefined,
          tenantId,
        };
        dispatch(actions.startExecution(startPayload));
        const result = await executionService
          .executeWorkflow(
            workflowId,
            { nodes: [], connections: [], inputs: inputs || {} },
            tenantId
          );
        dispatch(actions.endExecution(result));
        return result;
      } catch (error) {
        const msg = error instanceof Error
          ? error.message : 'Execution failed';
        throw new Error(msg);
      }
    },
    [dispatch, executionService, actions]
  );

  const stop = useCallback(async () => {
    if (!currentExecution?.id) {
      throw new Error('No execution running');
    }
    try {
      await executionService.cancelExecution(currentExecution.id);
      dispatch(actions.endExecution({
        ...currentExecution,
        status: 'stopped', endTime: Date.now(),
      }));
    } catch (error) {
      const msg = error instanceof Error
        ? error.message : 'Failed to stop execution';
      throw new Error(msg);
    }
  }, [currentExecution, dispatch, executionService, actions]);

  return { execute, stop };
}
