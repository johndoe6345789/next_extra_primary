/**
 * Selectors for the project slice
 */

import type { ProjectState } from './projectSlice';

/** Select all projects */
export const selectProjects = (
  state: { project: ProjectState }
) => state.project.projects;

/** Select the current project */
export const selectCurrentProject = (
  state: { project: ProjectState }
) => {
  if (!state.project.currentProjectId) {
    return null;
  }
  return state.project.projects.find(
    (p) =>
      p.id === state.project.currentProjectId
  );
};

/** Select current project ID */
export const selectCurrentProjectId = (
  state: { project: ProjectState }
) => state.project.currentProjectId;

/** Select loading state */
export const selectProjectIsLoading = (
  state: { project: ProjectState }
) => state.project.isLoading;

/** Select error state */
export const selectProjectError = (
  state: { project: ProjectState }
) => state.project.error;
