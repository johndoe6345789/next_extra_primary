/**
 * Project CRUD operations hook
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useServices } from '@shared/service-adapters';
import {
  setProjects, addProject,
  updateProject, removeProject,
  setProjectLoading, setProjectError,
} from '@shared/redux-slices';
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from '@shared/types';
import type { AppDispatch } from
  '@shared/redux-slices';
import { getTenantId, withLoading } from
  './hookUtils';

/** Project CRUD operations */
export function useProjectOperations() {
  const dispatch = useDispatch<AppDispatch>();
  const { projectService: ps } = useServices();
  const run = <T>(fb: string, fn: () =>
    Promise<T>) => withLoading(
    dispatch, setProjectLoading,
    setProjectError, fb, fn);

  const loadProjects = useCallback(async (
    workspaceId: string
  ) => run('Failed to load projects',
    async () => {
      const list = await ps.listProjects(
        getTenantId(), workspaceId);
      dispatch(setProjects(list));
      dispatch(setProjectError(null));
    }), [dispatch, ps]);

  const create = useCallback(async (
    data: CreateProjectRequest
  ) => run('Failed to create project',
    async () => {
      const p = await ps.createProject({
        ...data, tenantId: getTenantId() });
      dispatch(addProject(p));
      return p;
    }), [dispatch, ps]);

  const update = useCallback(async (
    id: string, data: UpdateProjectRequest
  ) => run('Failed to update project',
    async () => {
      const p = await ps.updateProject(id, data);
      dispatch(updateProject(p));
      return p;
    }), [dispatch, ps]);

  const del = useCallback(async (id: string) =>
    run('Failed to delete project', async () => {
      await ps.deleteProject(id);
      dispatch(removeProject(id));
    }), [dispatch, ps]);

  return {
    loadProjects,
    createProject: create,
    updateProject: update,
    deleteProject: del,
  };
}
