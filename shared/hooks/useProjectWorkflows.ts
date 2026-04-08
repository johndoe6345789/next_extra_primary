/**
 * useProjectWorkflows Hook
 * Manages workflows within a project via DBAL
 */

import { useEffect, useState } from 'react';
import type {
  ProjectWorkflow,
  UseProjectWorkflowsOptions,
} from './projectWorkflowsTypes';
import {
  useProjectWorkflowsCrud,
} from './projectWorkflowsCrud';
import {
  useLoadWorkflows,
} from './useProjectWorkflowsLoad';

export type {
  ProjectWorkflow,
} from './projectWorkflowsTypes';

/**
 * Hook for managing project workflows
 */
export function useProjectWorkflows(
  options: UseProjectWorkflowsOptions
) {
  const { projectId, autoLoad = true } =
    options;
  const [workflows, setWorkflows] =
    useState<ProjectWorkflow[]>([]);
  const [isLoading, setIsLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const tenant =
    options.tenant ??
    (typeof window !== 'undefined'
      ? localStorage.getItem('tenantId') ??
        'default'
      : 'default');
  const packageId =
    options.packageId ?? 'core';
  const base =
    `${tenant}/${packageId}/workflow`;

  const loadWorkflows = useLoadWorkflows(
    projectId, base,
    setWorkflows, setIsLoading, setError
  );

  const crud = useProjectWorkflowsCrud(
    base, setWorkflows,
    setIsLoading, setError
  );

  useEffect(() => {
    if (autoLoad && projectId) {
      loadWorkflows();
    }
  }, [autoLoad, projectId, loadWorkflows]);

  return {
    workflows, isLoading, error,
    loadWorkflows, ...crud,
  };
}

export default useProjectWorkflows;
