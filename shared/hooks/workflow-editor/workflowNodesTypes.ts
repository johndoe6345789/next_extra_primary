/**
 * Types for useWorkflowNodes
 */

export interface Position {
  x: number;
  y: number;
}

export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  position: Position;
  config: Record<string, unknown>;
  inputs: string[];
  outputs: string[];
}

export interface UseWorkflowNodesReturn {
  nodes: WorkflowNode[];
  selectedNodeId: string | null;
  draggingNodeId: string | null;
  addNode: (node: WorkflowNode) => void;
  updateNode: (
    id: string,
    updates: Partial<WorkflowNode>
  ) => void;
  deleteNode: (id: string) => void;
  setNodes: (nodes: WorkflowNode[]) => void;
  moveNode: (
    id: string,
    pos: Position
  ) => void;
  updateNodeConfig: (
    id: string,
    cfg: Record<string, unknown>
  ) => void;
  updateNodeName: (
    id: string,
    name: string
  ) => void;
  selectNode: (id: string | null) => void;
  clearSelection: () => void;
  startDrag: (
    id: string,
    offX: number,
    offY: number
  ) => void;
  updateDrag: (pos: Position) => void;
  endDrag: () => void;
  dragOffset: { x: number; y: number };
  getNode: (
    id: string
  ) => WorkflowNode | undefined;
  getSelectedNode: () =>
    | WorkflowNode
    | undefined;
}

export interface UseWorkflowNodesOptions {
  initialNodes?: WorkflowNode[];
  onNodesChange?: (
    nodes: WorkflowNode[]
  ) => void;
}
