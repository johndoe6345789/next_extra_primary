/**
 * Type definitions for useProjectSidebarLogic
 */

import type { Project } from '@shared/types';

/** Return type of useProjectSidebarLogic */
export interface UseProjectSidebarLogicReturn {
  isCollapsed: boolean;
  showNewProjectForm: boolean;
  newProjectName: string;
  starredProjects: Project[];
  regularProjects: Project[];
  setIsCollapsed: (
    collapsed: boolean
  ) => void;
  toggleCollapsed: () => void;
  setShowNewProjectForm: (
    show: boolean
  ) => void;
  setNewProjectName: (
    name: string
  ) => void;
  handleCreateProject: (
    e: React.FormEvent,
    onSuccess: () => void
  ) => Promise<void>;
  handleProjectClick: (
    projectId: string,
    onSelect: (id: string) => void
  ) => void;
  resetProjectForm: () => void;
}
