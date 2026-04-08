/**
 * Project slice type definitions
 */

import type { Project } from '../types/project';

/** Project slice state shape */
export interface ProjectState {
  projects: Project[];
  currentProjectId: string | null;
  isLoading: boolean;
  error: string | null;
}

/** Initial project state */
export const projectInitialState: ProjectState = {
  projects: [],
  currentProjectId: null,
  isLoading: false,
  error: null,
};
