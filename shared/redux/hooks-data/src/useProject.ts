/**
 * useProject Hook (Tier 2)
 * Manages project state and operations
 *
 * @example
 * ```ts
 * const {
 *   projects, createProject, loadProjects,
 * } = useProject();
 * await loadProjects('workspace-123');
 * ```
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  setCurrentProject,
} from '@shared/redux-slices';
import type { AppDispatch } from
  '@shared/redux-slices';
import { useProjectSelectors } from
  './useProjectSelectors';
import { useProjectOperations } from
  './useProjectOperations';

/** Project state and operations hook */
export function useProject() {
  const dispatch = useDispatch<AppDispatch>();
  const [isInit, setIsInit] = useState(false);
  const sel = useProjectSelectors();
  const ops = useProjectOperations();

  /** Switch to different project */
  const switchProject = useCallback(
    (id: string | null) => {
      dispatch(setCurrentProject(id));
      if (id) {
        localStorage.setItem(
          'currentProjectId', id
        );
      } else {
        localStorage.removeItem(
          'currentProjectId'
        );
      }
    }, [dispatch]
  );

  return {
    ...sel,
    isInitialized: isInit,
    ...ops,
    switchProject,
  };
}

export default useProject;
