/**
 * Workflow validation and metrics hook
 */

import { useCallback } from 'react';
import { useServices } from '@shared/service-adapters';
import type {
  Workflow, WorkflowNode,
  WorkflowConnection,
} from '@shared/types';

/** Workflow validation and metrics */
export function useWorkflowValidation(
  workflow: Workflow | null,
  nodes: WorkflowNode[],
  connections: WorkflowConnection[]
) {
  const { workflowService } = useServices();

  /** Validate workflow via service adapter */
  const validate = useCallback(async () => {
    if (!workflow)
      throw new Error('No workflow loaded');
    return workflowService.validateWorkflow(
      workflow.id,
      { ...workflow, nodes, connections }
    );
  }, [workflow, nodes, connections,
    workflowService]);

  /** Get workflow complexity metrics */
  const getMetrics = useCallback(async () => {
    if (!workflow)
      throw new Error('No workflow loaded');
    return workflowService.getWorkflowMetrics(
      { ...workflow, nodes, connections }
    );
  }, [workflow, nodes, connections,
    workflowService]);

  return { validate, getMetrics };
}
