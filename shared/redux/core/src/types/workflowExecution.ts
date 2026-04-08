/**
 * Workflow execution result type definitions
 */

/**
 * Execution result for individual node
 */
export interface NodeExecutionResult {
  nodeId: string;
  nodeName: string;
  status:
    | 'pending' | 'running' | 'success'
    | 'error' | 'skipped';
  startTime: number;
  endTime?: number;
  duration?: number;
  data?: unknown;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
}

/**
 * Complete execution result
 */
export interface ExecutionResult {
  id: string;
  workflowId: string;
  workflowName: string;
  tenantId: string;
  status:
    | 'pending' | 'running' | 'success'
    | 'error' | 'stopped';
  startTime: number;
  endTime?: number;
  duration?: number;
  nodes: NodeExecutionResult[];
  error?: {
    code: string;
    message: string;
    nodeId?: string;
  };
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  triggeredBy?: string;
}

/** Node selection state */
export interface SelectionState {
  selectedNodes: Set<string>;
  selectedConnections: Set<string>;
}

/** Editor viewport state */
export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}
