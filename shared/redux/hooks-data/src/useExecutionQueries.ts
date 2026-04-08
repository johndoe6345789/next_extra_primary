/**
 * Execution query operations hook
 */

import { useCallback } from 'react';
import { useServices } from '@shared/service-adapters';
import type {
  ExecutionResult, ExecutionStats,
} from '@shared/types';

/** Execution detail, stats, and history */
export function useExecutionQueries() {
  const { executionService } = useServices();

  /** Get detailed execution information */
  const getDetails = useCallback(async (
    executionId: string
  ): Promise<ExecutionResult | null> => {
    try {
      return await executionService
        .getExecutionDetails(executionId);
    } catch (e) {
      const msg = e instanceof Error
        ? e.message
        : 'Failed to get execution details';
      throw new Error(msg);
    }
  }, [executionService]);

  /** Get execution statistics */
  const getStats = useCallback(async (
    workflowId: string,
    tenantId = 'default'
  ): Promise<ExecutionStats> => {
    try {
      return await executionService
        .getExecutionStats(
          workflowId, tenantId
        );
    } catch (e) {
      const msg = e instanceof Error
        ? e.message
        : 'Failed to get execution statistics';
      throw new Error(msg);
    }
  }, [executionService]);

  /** Get execution history */
  const getHistory = useCallback(async (
    workflowId: string,
    tenantId = 'default',
    limit = 50
  ): Promise<ExecutionResult[]> => {
    try {
      const validLimit = Math.min(
        Math.max(limit, 1), 100
      );
      return await executionService
        .getExecutionHistory(
          workflowId, tenantId, validLimit
        );
    } catch (e) {
      const msg = e instanceof Error
        ? e.message
        : 'Failed to get execution history';
      throw new Error(msg);
    }
  }, [executionService]);

  return { getDetails, getStats, getHistory };
}
