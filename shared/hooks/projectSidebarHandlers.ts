/**
 * Project sidebar action handlers
 */

import { useCallback } from 'react';

/**
 * Build sidebar action handlers
 * @param newProjectName - Current input
 * @param resetProjectForm - Reset callback
 */
export function useProjectHandlers(
  newProjectName: string,
  resetProjectForm: () => void
) {
  const handleCreateProject = useCallback(
    async (
      e: React.FormEvent,
      onSuccess: () => void
    ) => {
      e.preventDefault();
      if (!newProjectName.trim()) return;
      try {
        await onSuccess?.();
        resetProjectForm();
      } catch (err) {
        console.error(
          'Create project:', err
        );
      }
    },
    [newProjectName, resetProjectForm]
  );

  const handleProjectClick = useCallback(
    (
      projectId: string,
      onSelect: (id: string) => void
    ) => {
      onSelect(projectId);
    },
    []
  );

  return {
    handleCreateProject,
    handleProjectClick,
  };
}
