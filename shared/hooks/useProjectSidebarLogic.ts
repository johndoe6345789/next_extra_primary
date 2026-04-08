/**
 * useProjectSidebarLogic Hook
 * Project sidebar business logic
 */

import { useState, useMemo } from 'react';
import type { Project } from '@shared/types';
import type {
  UseProjectSidebarLogicReturn,
} from './projectSidebarLogicTypes';
import {
  useProjectHandlers,
} from './projectSidebarHandlers';

export type {
  UseProjectSidebarLogicReturn,
} from './projectSidebarLogicTypes';

/** Hook for project sidebar logic */
export const useProjectSidebarLogic = (
  projects: Project[]
): UseProjectSidebarLogicReturn => {
  const [isCollapsed, setIsCollapsed] =
    useState(false);
  const [showNewProjectForm, setShowNew] =
    useState(false);
  const [newProjectName, setNewProjectName] =
    useState('');

  const starredProjects = useMemo(
    () => projects.filter((p) => p.starred),
    [projects]
  );
  const regularProjects = useMemo(
    () => projects.filter((p) => !p.starred),
    [projects]
  );

  const resetProjectForm = () => {
    setShowNew(false);
    setNewProjectName('');
  };

  const { handleCreateProject, handleProjectClick } =
    useProjectHandlers(
      newProjectName, resetProjectForm
    );

  return {
    isCollapsed,
    showNewProjectForm,
    newProjectName,
    starredProjects,
    regularProjects,
    setIsCollapsed,
    toggleCollapsed: () =>
      setIsCollapsed((p) => !p),
    setShowNewProjectForm: setShowNew,
    setNewProjectName,
    handleCreateProject,
    handleProjectClick,
    resetProjectForm,
  };
};
