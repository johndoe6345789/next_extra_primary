/**
 * Redux selectors for project state
 */

import { useSelector } from 'react-redux';
import type { ProjectRootState } from './projectTypes';

/** Select all project state from Redux */
export function useProjectSelectors() {
  const projects = useSelector(
    (s: ProjectRootState) =>
      s.project?.projects ?? []
  );
  const currentProject = useSelector(
    (s: ProjectRootState) =>
      s.project?.currentProject ?? null
  );
  const currentProjectId = useSelector(
    (s: ProjectRootState) =>
      s.project?.currentProjectId ?? null
  );
  const isLoading = useSelector(
    (s: ProjectRootState) =>
      s.project?.isLoading ?? false
  );
  const error = useSelector(
    (s: ProjectRootState) =>
      s.project?.error ?? null
  );

  return {
    projects,
    currentProject,
    currentProjectId,
    isLoading,
    error,
  };
}
