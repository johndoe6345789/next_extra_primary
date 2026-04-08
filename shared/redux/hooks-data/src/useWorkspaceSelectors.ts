/**
 * Workspace Redux selectors hook
 */

import { useSelector } from 'react-redux';
import {
  selectWorkspaces,
  selectCurrentWorkspace,
  selectCurrentWorkspaceId,
  selectWorkspaceIsLoading,
  selectWorkspaceError,
} from '@shared/redux-slices';
import type { RootState } from '@shared/redux-slices';

/** Select workspace state from Redux store */
export function useWorkspaceSelectors() {
  const workspaces = useSelector(
    (s: RootState) => selectWorkspaces(s)
  );
  const currentWorkspace = useSelector(
    (s: RootState) => selectCurrentWorkspace(s)
  );
  const currentWorkspaceId = useSelector(
    (s: RootState) => selectCurrentWorkspaceId(s)
  );
  const isLoading = useSelector(
    (s: RootState) => selectWorkspaceIsLoading(s)
  );
  const error = useSelector(
    (s: RootState) => selectWorkspaceError(s)
  );

  return {
    workspaces, currentWorkspace,
    currentWorkspaceId, isLoading, error,
  };
}
