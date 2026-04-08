/**
 * Execution query callbacks (details, stats, history)
 */

import { useCallback } from 'react';
import type { ExecutionService } from './executionTypes';

/** Create query callbacks */
export function useExecutionQuery(
  executionService: ExecutionService
) {
  const getDetails = useCallback(
    async (executionId: string) => {
      try {
        return await executionService
          .getExecutionDetails(executionId);
      } catch (error) {
        const msg = error instanceof Error
          ? error.message : 'Failed to get details';
        throw new Error(msg);
      }
    },
    [executionService]
  );

  const getStats = useCallback(
    async (workflowId: string, tenantId = 'default') => {
      try {
        return await executionService
          .getExecutionStats(workflowId, tenantId);
      } catch (error) {
        const msg = error instanceof Error
          ? error.message : 'Failed to get stats';
        throw new Error(msg);
      }
    },
    [executionService]
  );

  const getHistory = useCallback(
    async (
      workflowId: string,
      tenantId = 'default',
      limit = 50
    ) => {
      try {
        const validLimit = Math.min(Math.max(limit, 1), 100);
        return await executionService
          .getExecutionHistory(workflowId, tenantId, validLimit);
      } catch (error) {
        const msg = error instanceof Error
          ? error.message : 'Failed to get history';
        throw new Error(msg);
      }
    },
    [executionService]
  );

  return { getDetails, getStats, getHistory };
}
