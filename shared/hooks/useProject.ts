/**
 * useProject Hook - Manages project state
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProjectOperations } from './projectOperations';
import { useProjectSelectors } from './projectSelectors';
import {
  useLoadProjects,
  useSwitchProject,
} from './projectLoadSwitch';

export type { Project } from '@shared/types';
export type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from './projectTypes';

/**
 * Self-contained project hook with Redux
 */
export function useProject() {
  const dispatch = useDispatch();
  const selectors = useProjectSelectors();
  const [isInitialized, setIsInitialized] =
    useState(false);

  const getTenantId = useCallback(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('tenantId') ||
        'default'
      );
    }
    return 'default';
  }, []);

  const ops = useProjectOperations(getTenantId);
  const loadProjects =
    useLoadProjects(dispatch, getTenantId);
  const switchProject =
    useSwitchProject(dispatch);

  return {
    ...selectors,
    isInitialized,
    setIsInitialized,
    loadProjects,
    ...ops,
    switchProject,
  };
}

export default useProject;
