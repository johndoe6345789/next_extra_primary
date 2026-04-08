/**
 * Types for useWorkflowEditor
 */

import type {
  UseWorkflowCanvasReturn,
} from './useWorkflowCanvas';
import type {
  UseWorkflowNodesReturn,
} from './useWorkflowNodes';
import type {
  UseWorkflowConnectionsReturn,
} from './useWorkflowConnections';
import type {
  UseNodeTypesReturn,
} from './useNodeTypes';
import type {
  UseWorkflowExecutionReturn,
} from './useWorkflowExecution';
import type {
  UseWorkflowPersistenceReturn,
} from './useWorkflowPersistence';
import type {
  Workflow,
  WorkflowNode,
  Connection,
  Position,
  NodeTypeDefinition,
} from '../../types/workflow-editor';

/** Return type of useWorkflowEditor */
export interface UseWorkflowEditorReturn {
  canvasHook: UseWorkflowCanvasReturn;
  nodesHook: UseWorkflowNodesReturn;
  connectionsHook: UseWorkflowConnectionsReturn;
  nodeTypesHook: UseNodeTypesReturn;
  executionHook: UseWorkflowExecutionReturn;
  persistenceHook: UseWorkflowPersistenceReturn;
  workflow: Workflow;
  nodes: WorkflowNode[];
  connections: Connection[];
  zoom: number;
  pan: Position;
  isPanning: boolean;
  selectedNodeId: string | null;
  selectedNode: WorkflowNode | undefined;
  selectedNodeType:
    | NodeTypeDefinition
    | undefined;
  nodeTypes: NodeTypeDefinition[];
  filteredNodeTypes: NodeTypeDefinition[];
  nodeSearch: string;
  setNodeSearch: (q: string) => void;
  addNodeFromPalette: (
    nt: NodeTypeDefinition,
    pos: Position
  ) => WorkflowNode;
  deleteSelectedNode: () => void;
  updateSelectedNodeConfig: (
    cfg: Record<string, unknown>
  ) => void;
  updateSelectedNodeName: (n: string) => void;
  isDirty: boolean;
  isSaving: boolean;
  isExecuting: boolean;
}

/** Options for useWorkflowEditor */
export interface UseWorkflowEditorOptions {
  workflowId: string;
  initialWorkflow?: Partial<Workflow>;
  onSave?: (w: Workflow) => Promise<void>;
  onLoad?: (id: string) => Promise<Workflow>;
  autoSaveEnabled?: boolean;
}
