/**
 * Project load and switch operations
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  setProjects,
  setCurrentProject,
  setProjectLoading,
  setProjectError,
} from '@shared/redux-slices';
import { getMockProjects } from './projectMockData';

/**
 * Create loadProjects callback
 * @param dispatch - Redux dispatch
 * @param getTenantId - Tenant ID getter
 */
export function useLoadProjects(
  dispatch: ReturnType<typeof useDispatch>,
  getTenantId: () => string
) {
  return useCallback(
    async (workspaceId: string) => {
      dispatch(setProjectLoading(true));
      try {
        const mocks = getMockProjects(
          workspaceId,
          getTenantId()
        );
        const filtered = mocks.filter(
          (p) => p.workspaceId === workspaceId
        );
        dispatch(setProjects(filtered));
        dispatch(setProjectError(null));
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : 'Failed to load projects';
        dispatch(setProjectError(msg));
      } finally {
        dispatch(setProjectLoading(false));
      }
    },
    [dispatch, getTenantId]
  );
}

/**
 * Create switchProject callback
 * @param dispatch - Redux dispatch
 */
export function useSwitchProject(
  dispatch: ReturnType<typeof useDispatch>
) {
  return useCallback(
    (id: string | null) => {
      dispatch(setCurrentProject(id));
      if (typeof window !== 'undefined') {
        if (id) {
          localStorage.setItem(
            'currentProjectId',
            id
          );
        } else {
          localStorage.removeItem(
            'currentProjectId'
          );
        }
      }
    },
    [dispatch]
  );
}
