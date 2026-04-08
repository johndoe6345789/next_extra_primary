/**
 * Dashboard workspace action handlers
 */

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardDeps {
  newWorkspaceName: string;
  createWorkspace: (data: {
    name: string;
    description: string;
    color: string;
  }) => Promise<{ id: string }>;
  switchWorkspace: (id: string) => void;
  resetWorkspaceForm: () => void;
}

/** Create workspace action handlers */
export function useDashboardHandlers(
  deps: DashboardDeps,
  router: ReturnType<typeof useRouter>
) {
  const {
    newWorkspaceName,
    createWorkspace,
    switchWorkspace,
    resetWorkspaceForm,
  } = deps;

  const handleCreateWorkspace = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newWorkspaceName.trim()) return;
      try {
        const ws = await createWorkspace({
          name: newWorkspaceName,
          description: '',
          color: '#1976d2',
        });
        resetWorkspaceForm();
        switchWorkspace(ws.id);
        router.push(`/workspace/${ws.id}`);
      } catch (err) {
        console.error(
          'Create workspace:',
          err
        );
      }
    },
    [
      newWorkspaceName,
      createWorkspace,
      switchWorkspace,
      router,
      resetWorkspaceForm,
    ]
  );

  const handleWorkspaceClick = useCallback(
    (workspaceId: string) => {
      switchWorkspace(workspaceId);
      router.push(
        `/workspace/${workspaceId}`
      );
    },
    [switchWorkspace, router]
  );

  return {
    handleCreateWorkspace,
    handleWorkspaceClick,
  };
}
