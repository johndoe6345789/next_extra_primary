/**
 * Workflow editor hook initialization
 */

import { useMemo } from 'react';
import { useWorkflowCanvas } from './useWorkflowCanvas';
import { useWorkflowNodes } from './useWorkflowNodes';
import { useWorkflowConnections } from './useWorkflowConnections';
import { useNodeTypes } from './useNodeTypes';
import { useWorkflowExecution } from './useWorkflowExecution';
import { useWorkflowPersistence } from './useWorkflowPersistence';
import type { Workflow } from '../../types/workflow-editor';
import type {
  UseWorkflowEditorOptions,
} from './workflowEditorTypes';

const DEFAULT_START_NODE = {
  id: 'node_1',
  type: 'manual',
  name: 'Start',
  position: { x: 100, y: 200 },
  config: {},
  inputs: [] as string[],
  outputs: ['main'],
};

/** Initialize all sub-hooks for the editor */
export function useEditorInit(
  opts: UseWorkflowEditorOptions
) {
  const { workflowId, initialWorkflow } = opts;

  const canvasHook = useWorkflowCanvas();
  const nodesHook = useWorkflowNodes({
    initialNodes:
      initialWorkflow?.nodes || [
        DEFAULT_START_NODE,
      ],
  });
  const connectionsHook = useWorkflowConnections({
    initialConnections:
      initialWorkflow?.connections || [],
  });
  const nodeTypesHook = useNodeTypes();
  const executionHook = useWorkflowExecution();

  const workflow = useMemo<Workflow>(
    () => ({
      id: workflowId,
      name:
        initialWorkflow?.name || 'My Workflow',
      description:
        initialWorkflow?.description || '',
      nodes: nodesHook.nodes,
      connections: connectionsHook.connections,
      createdAt:
        initialWorkflow?.createdAt ||
        new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    [
      workflowId,
      initialWorkflow,
      nodesHook.nodes,
      connectionsHook.connections,
    ]
  );

  const persistenceHook = useWorkflowPersistence({
    workflow,
    onSave: opts.onSave,
    onLoad: opts.onLoad,
    autoSaveEnabled: opts.autoSaveEnabled,
  });

  return {
    canvasHook,
    nodesHook,
    connectionsHook,
    nodeTypesHook,
    executionHook,
    persistenceHook,
    workflow,
  };
}
