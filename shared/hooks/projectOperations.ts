/**
 * Project CRUD operations (create, update, delete)
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateProject as updateProjectAction,
  setProjectLoading,
  setProjectError,
} from '@shared/redux-slices';
import type { Project } from '@shared/types';
import type {
  UpdateProjectRequest,
  ProjectRootState,
} from './projectTypes';
import { useCreateProject } from './projectCreateOp';
import { useDeleteProject } from './projectDeleteOp';

/**
 * Hook for project create/update/delete ops
 * @param getTenantId - Function returning tenant
 */
export function useProjectOperations(
  getTenantId: () => string
) {
  const dispatch = useDispatch();
  const projects = useSelector(
    (s: ProjectRootState) =>
      s.project?.projects ?? []
  );

  const createProject =
    useCreateProject(dispatch, getTenantId);
  const deleteProject =
    useDeleteProject(dispatch);

  /** Update an existing project */
  const updateProjectData = useCallback(
    async (
      id: string,
      data: UpdateProjectRequest
    ): Promise<Project> => {
      dispatch(setProjectLoading(true));
      try {
        const existing = projects.find(
          (p) => p.id === id
        );
        if (!existing) {
          throw new Error('Project not found');
        }
        const updated: Project = {
          ...existing,
          ...data,
          updatedAt: Date.now(),
        };
        dispatch(updateProjectAction(updated));
        return updated;
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to update project';
        dispatch(setProjectError(msg));
        throw err;
      } finally {
        dispatch(setProjectLoading(false));
      }
    },
    [dispatch, projects]
  );

  return {
    createProject,
    updateProject: updateProjectData,
    deleteProject,
  };
}
