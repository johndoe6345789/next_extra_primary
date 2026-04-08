/**
 * Type definitions for useProject hook
 */

import type { Project } from '@shared/types';

/** Create project request */
export interface CreateProjectRequest {
  name: string;
  description?: string;
  workspaceId: string;
  tenantId?: string;
  color?: string;
  [key: string]: unknown;
}

/** Update project request */
export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  starred?: boolean;
  [key: string]: unknown;
}

/** Redux project state shape */
export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentProjectId: string | null;
  isLoading: boolean;
  error: string | null;
}

/** Root state with project slice */
export interface ProjectRootState {
  project: ProjectState;
}
