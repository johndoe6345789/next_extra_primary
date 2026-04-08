/**
 * Workspace CRUD operations hook
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useServices } from '@shared/service-adapters';
import {
  setWorkspaces, addWorkspace,
  updateWorkspace, removeWorkspace,
  setCurrentWorkspace,
  setWorkspaceLoading, setWorkspaceError,
} from '@shared/redux-slices';
import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
} from '@shared/service-adapters';
import type { AppDispatch } from
  '@shared/redux-slices';
import { getTenantId, withLoading } from
  './hookUtils';

/** Workspace CRUD operations */
export function useWorkspaceOperations(
  currentWsId: string | null
) {
  const dispatch = useDispatch<AppDispatch>();
  const { workspaceService: ws } = useServices();
  const run = <T>(fb: string, fn: () =>
    Promise<T>) => withLoading(
    dispatch, setWorkspaceLoading,
    setWorkspaceError, fb, fn);

  const loadWorkspaces = useCallback(async () => {
    await run('Failed to load workspaces',
      async () => {
        const list = await ws.listWorkspaces(
          getTenantId());
        dispatch(setWorkspaces(list));
        if (!currentWsId && list.length) {
          dispatch(setCurrentWorkspace(
            list[0].id));
          localStorage.setItem(
            'currentWorkspaceId', list[0].id);
        }
        dispatch(setWorkspaceError(null));
      });
  }, [dispatch, currentWsId, ws]);

  const create = useCallback(async (
    data: CreateWorkspaceRequest
  ) => run('Failed to create workspace',
    async () => {
      const r = await ws.createWorkspace({
        ...data, tenantId: getTenantId() });
      dispatch(addWorkspace(r));
      return r;
    }), [dispatch, ws]);

  const update = useCallback(async (
    id: string, data: UpdateWorkspaceRequest
  ) => run('Failed to update workspace',
    async () => {
      const r = await ws.updateWorkspace(
        id, data);
      dispatch(updateWorkspace(r));
      return r;
    }), [dispatch, ws]);

  const del = useCallback(async (id: string) =>
    run('Failed to delete workspace', async () => {
      await ws.deleteWorkspace(id);
      dispatch(removeWorkspace(id));
    }), [dispatch, ws]);

  return {
    loadWorkspaces,
    createWorkspace: create,
    updateWorkspace: update,
    deleteWorkspace: del,
  };
}
