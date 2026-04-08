/**
 * useWorkflow Hook (Tier 2)
 * Manages workflow state and operations
 *
 * @example
 * ```ts
 * const {
 *   workflow, nodes, connections,
 *   validate, getMetrics,
 * } = useWorkflow();
 * ```
 */

import { useWorkflowSelectors } from
  './useWorkflowSelectors';
import { useWorkflowOperations } from
  './useWorkflowOperations';
import { useWorkflowValidation } from
  './useWorkflowValidation';

/** Workflow state and operations hook */
export function useWorkflow() {
  const sel = useWorkflowSelectors();
  const {
    workflow, nodes, connections,
    isDirty, isSaving,
  } = sel;

  const ops = useWorkflowOperations(
    workflow, isDirty, isSaving
  );
  const validation = useWorkflowValidation(
    workflow, nodes, connections
  );

  return {
    workflow, nodes, connections,
    isDirty, isSaving,
    ...ops,
    ...validation,
  };
}

export default useWorkflow;
