/**
 * Create workflow operation for projects
 */

import { useCallback } from 'react';
import type {
  ProjectWorkflow,
} from './projectWorkflowsTypes';
import { transformWorkflow } from './projectWorkflowsTypes';
import { dbalFetch } from './workspaceDbal';

/** Create project workflow factory */
export function useCreateProjectWorkflow(
  base: string,
  setWorkflows: React.Dispatch<
    React.SetStateAction<ProjectWorkflow[]>
  >,
  setIsLoading: (v: boolean) => void,
  setError: (v: string | null) => void
) {
  return useCallback(
    async (data: {
      name: string;
      description?: string;
      category?: string;
    }): Promise<ProjectWorkflow | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const w = await dbalFetch<
          Record<string, unknown>
        >('POST', base, {
          name: data.name,
          description: data.description || '',
          version: '1.0.0',
          category: data.category || 'custom',
          status: 'draft',
          nodes: [
            {
              id: 'start',
              name: 'Start',
              type: 'frame.begin',
              typeVersion: 1,
              position: [0, 0],
              parameters: {},
            },
          ],
          connections: {},
          metadata: {},
          executionConfig: {},
          isPublished: false,
          isArchived: false,
        });
        const transformed: ProjectWorkflow = {
          ...transformWorkflow(w),
          nodeCount: 1,
          isPublished: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setWorkflows((prev) => [
          transformed,
          ...prev,
        ]);
        return transformed;
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to create workflow';
        setError(msg);
        console.error('Create workflow:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [base, setWorkflows, setIsLoading, setError]
  );
}
