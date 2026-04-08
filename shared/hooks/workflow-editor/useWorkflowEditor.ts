/**
 * useWorkflowEditor Hook (Master Composition)
 * Composes all workflow editor hooks
 */

import type {
  UseWorkflowEditorReturn,
  UseWorkflowEditorOptions,
} from './workflowEditorTypes';
import { useEditorInit } from './workflowEditorInit';
import { useEditorActions } from './workflowEditorActions';

export type {
  UseWorkflowEditorReturn,
  UseWorkflowEditorOptions,
} from './workflowEditorTypes';

/** Master workflow editor hook */
export function useWorkflowEditor(
  opts: UseWorkflowEditorOptions
): UseWorkflowEditorReturn {
  const init = useEditorInit(opts);
  const {
    canvasHook,
    nodesHook,
    connectionsHook,
    nodeTypesHook,
    executionHook,
    persistenceHook,
    workflow,
  } = init;

  const selectedNode =
    nodesHook.getSelectedNode();
  const selectedNodeType = selectedNode
    ? nodeTypesHook.getNodeType(
        selectedNode.type
      )
    : undefined;

  const actions = useEditorActions(
    nodesHook,
    connectionsHook,
    persistenceHook
  );

  return {
    canvasHook,
    nodesHook,
    connectionsHook,
    nodeTypesHook,
    executionHook,
    persistenceHook,
    workflow,
    nodes: nodesHook.nodes,
    connections: connectionsHook.connections,
    zoom: canvasHook.zoom,
    pan: canvasHook.pan,
    isPanning: canvasHook.isPanning,
    selectedNodeId: nodesHook.selectedNodeId,
    selectedNode,
    selectedNodeType,
    nodeTypes: nodeTypesHook.nodeTypes,
    filteredNodeTypes:
      nodeTypesHook.filteredNodeTypes,
    nodeSearch: nodeTypesHook.searchQuery,
    setNodeSearch:
      nodeTypesHook.setSearchQuery,
    ...actions,
    isDirty: persistenceHook.isDirty,
    isSaving: persistenceHook.isSaving,
    isExecuting: executionHook.isExecuting,
  };
}
