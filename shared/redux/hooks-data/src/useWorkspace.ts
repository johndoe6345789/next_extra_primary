/**
 * useWorkspace Hook (Tier 2)
 * Manages workspace state and operations
 *
 * @example
 * ```ts
 * const {
 *   workspaces, createWorkspace,
 *   loadWorkspaces,
 * } = useWorkspace();
 * ```
 */

import { useCallback, useEffect, useState } from
  'react';
import { useDispatch } from 'react-redux';
import {
  setCurrentWorkspace,
} from '@shared/redux-slices';
import type { AppDispatch } from
  '@shared/redux-slices';
import { useWorkspaceSelectors } from
  './useWorkspaceSelectors';
import { useWorkspaceOperations } from
  './useWorkspaceOperations';

/** Workspace state and operations hook */
export function useWorkspace() {
  const dispatch = useDispatch<AppDispatch>();
  const [isInit, setIsInit] = useState(false);
  const sel = useWorkspaceSelectors();
  const ops = useWorkspaceOperations(
    sel.currentWorkspaceId
  );

  useEffect(() => {
    if (!isInit) {
      ops.loadWorkspaces();
      setIsInit(true);
    }
  }, [isInit]);

  /** Switch to different workspace */
  const switchWorkspace = useCallback(
    (id: string | null) => {
      dispatch(setCurrentWorkspace(id));
      if (id) {
        localStorage.setItem(
          'currentWorkspaceId', id
        );
      } else {
        localStorage.removeItem(
          'currentWorkspaceId'
        );
      }
    }, [dispatch]
  );

  return {
    ...sel,
    isInitialized: isInit,
    ...ops,
    switchWorkspace,
  };
}

export default useWorkspace;
