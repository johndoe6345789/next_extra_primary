/**
 * Project create operation
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  addProject as addProjectAction,
  setProjectLoading,
  setProjectError,
} from '@shared/redux-slices';
import type { Project } from '@shared/types';
import type {
  CreateProjectRequest,
} from './projectTypes';

/** Create project factory hook */
export function useCreateProject(
  dispatch: ReturnType<typeof useDispatch>,
  getTenantId: () => string
) {
  return useCallback(
    async (
      data: CreateProjectRequest
    ): Promise<Project> => {
      dispatch(setProjectLoading(true));
      try {
        const tenantId = getTenantId();
        const project: Project = {
          id: `proj-${Date.now()}`,
          name: data.name,
          description: data.description || '',
          workspaceId: data.workspaceId,
          tenantId,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          starred: false,
          color: data.color || '#1976d2',
        };
        dispatch(addProjectAction(project));
        return project;
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to create project';
        dispatch(setProjectError(msg));
        throw err;
      } finally {
        dispatch(setProjectLoading(false));
      }
    },
    [dispatch, getTenantId]
  );
}
