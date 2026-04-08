/**
 * Workflow Redux selectors hook
 */

import { useSelector } from 'react-redux';
import {
  selectCurrentWorkflow,
  selectWorkflowNodes,
  selectWorkflowConnections,
  selectWorkflowIsDirty,
  selectWorkflowIsSaving,
} from '@shared/redux-slices';
import type { RootState } from '@shared/redux-slices';

/** Select workflow state from Redux store */
export function useWorkflowSelectors() {
  const workflow = useSelector(
    (s: RootState) => selectCurrentWorkflow(s)
  );
  const nodes = useSelector(
    (s: RootState) => selectWorkflowNodes(s)
  );
  const connections = useSelector(
    (s: RootState) => selectWorkflowConnections(s)
  );
  const isDirty = useSelector(
    (s: RootState) => selectWorkflowIsDirty(s)
  );
  const isSaving = useSelector(
    (s: RootState) => selectWorkflowIsSaving(s)
  );

  return {
    workflow, nodes, connections,
    isDirty, isSaving,
  };
}
