/**
 * Workflow loading logic for useProjectWorkflows
 */

import { useCallback } from 'react';
import type {
  ProjectWorkflow,
} from './projectWorkflowsTypes';
import { transformWorkflow } from './projectWorkflowsTypes';
import { dbalFetch } from './workspaceDbal';

type SetState<T> = React.Dispatch<
  React.SetStateAction<T>
>

/**
 * Build loadWorkflows callback
 * @param projectId - Project to load for
 * @param base - DBAL base path
 * @param setWorkflows - Workflow state setter
 * @param setIsLoading - Loading flag setter
 * @param setError - Error state setter
 */
export function useLoadWorkflows(
  projectId: string,
  base: string,
  setWorkflows: SetState<ProjectWorkflow[]>,
  setIsLoading: SetState<boolean>,
  setError: SetState<string | null>
) {
  return useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        isArchived: 'false',
        projectId,
      }).toString();
      const result = await dbalFetch<{
        data: Record<string, unknown>[];
      }>('GET', `${base}?${qs}`);
      const transformed = (
        result?.data ?? []
      ).map(transformWorkflow);
      setWorkflows(transformed);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Failed to load workflows';
      setError(msg);
      console.error('Load workflows:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, base]);
}
