/**
 * useDashboardLogic Hook
 * Dashboard page business logic
 */

import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from './useWorkspace';
import type {
  UseDashboardLogicReturn,
} from './dashboardLogicTypes';
import { useDashboardHandlers } from './dashboardWorkspaceHandlers';

export type {
  UseDashboardLogicReturn,
} from './dashboardLogicTypes';

/** Hook for dashboard logic */
export const useDashboardLogic =
  (): UseDashboardLogicReturn => {
    const router = useRouter();
    const {
      workspaces,
      currentWorkspace,
      switchWorkspace,
      createWorkspace,
      loadWorkspaces,
    } = useWorkspace();

    const [isLoading, setIsLoading] =
      useState(true);
    const [showCreateForm, setShowCreateForm] =
      useState(false);
    const [newWorkspaceName, setNewWorkspaceName] =
      useState('');

    useEffect(() => {
      loadWorkspaces().finally(() =>
        setIsLoading(false)
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resetWorkspaceForm = useCallback(
      () => {
        setShowCreateForm(false);
        setNewWorkspaceName('');
      },
      []
    );

    const {
      handleCreateWorkspace,
      handleWorkspaceClick,
    } = useDashboardHandlers(
      {
        newWorkspaceName,
        createWorkspace,
        switchWorkspace,
        resetWorkspaceForm,
      },
      router
    );

    return {
      isLoading,
      showCreateForm,
      newWorkspaceName,
      workspaces,
      currentWorkspace,
      setShowCreateForm,
      setNewWorkspaceName,
      handleCreateWorkspace,
      handleWorkspaceClick,
      resetWorkspaceForm,
    };
  };
