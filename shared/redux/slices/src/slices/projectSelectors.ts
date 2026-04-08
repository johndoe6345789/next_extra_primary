/**
 * Selectors for project state
 */

import type { Project } from '../types/project';

/** Project state shape */
interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  isLoading: boolean;
  error: string | null;
}

/** Select all projects */
export const selectProjects = (
  state: { project: ProjectState }
) => state.project.projects;

/** Select current project object */
export const selectCurrentProject = (
  state: { project: ProjectState }
) => {
  if (!state.project.currentProjectId) return null;
  return state.project.projects.find(
    (p) => p.id === state.project.currentProjectId
  );
};

/** Select current project ID */
export const selectCurrentProjectId = (
  state: { project: ProjectState }
) => state.project.currentProjectId;

/** Select project loading state */
export const selectProjectIsLoading = (
  state: { project: ProjectState }
) => state.project.isLoading;

/** Select project error */
export const selectProjectError = (
  state: { project: ProjectState }
) => state.project.error;
