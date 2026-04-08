/**
 * Project Redux selectors hook
 */

import { useSelector } from 'react-redux';
import {
  selectProjects,
  selectCurrentProject,
  selectCurrentProjectId,
  selectProjectIsLoading,
  selectProjectError,
} from '@shared/redux-slices';
import type { RootState } from '@shared/redux-slices';

/** Select project state from Redux store */
export function useProjectSelectors() {
  const projects = useSelector(
    (s: RootState) => selectProjects(s)
  );
  const currentProject = useSelector(
    (s: RootState) => selectCurrentProject(s)
  );
  const currentProjectId = useSelector(
    (s: RootState) => selectCurrentProjectId(s)
  );
  const isLoading = useSelector(
    (s: RootState) => selectProjectIsLoading(s)
  );
  const error = useSelector(
    (s: RootState) => selectProjectError(s)
  );

  return {
    projects, currentProject,
    currentProjectId, isLoading, error,
  };
}
