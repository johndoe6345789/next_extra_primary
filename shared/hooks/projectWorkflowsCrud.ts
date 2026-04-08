/**
 * CRUD operations for project workflows
 */

import { useCallback } from 'react';
import type {
  ProjectWorkflow,
} from './projectWorkflowsTypes';
import { dbalFetch } from './workspaceDbal';
import {
  useCreateProjectWorkflow,
} from './projectWorkflowCreate';

/**
 * Hook for workflow create/delete in a project
 * @param base - DBAL base path
 * @param setWorkflows - State setter
 * @param setIsLoading - Loading state setter
 * @param setError - Error state setter
 */
export function useProjectWorkflowsCrud(
  base: string,
  setWorkflows: React.Dispatch<
    React.SetStateAction<ProjectWorkflow[]>
  >,
  setIsLoading: (v: boolean) => void,
  setError: (v: string | null) => void
) {
  const createWorkflow =
    useCreateProjectWorkflow(
      base, setWorkflows,
      setIsLoading, setError
    );

  /** Delete (archive) a workflow */
  const deleteWorkflow = useCallback(
    async (workflowId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await dbalFetch<void>(
          'PUT',
          `${base}/${workflowId}`,
          { isArchived: true }
        );
        setWorkflows((prev) =>
          prev.filter(
            (w) => w.id !== workflowId
          )
        );
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to delete workflow';
        setError(msg);
        console.error('Delete workflow:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [base, setWorkflows, setIsLoading, setError]
  );

  return { createWorkflow, deleteWorkflow };
}
