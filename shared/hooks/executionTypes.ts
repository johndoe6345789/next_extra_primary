/**
 * Type definitions for useExecution hook
 */

/** Execution result type */
export interface ExecutionResult {
  id: string;
  workflowId: string;
  workflowName: string;
  status:
    | 'running'
    | 'completed'
    | 'failed'
    | 'stopped';
  startTime: number;
  endTime?: number;
  nodes: unknown[];
  output?: unknown;
  error?: string;
  tenantId: string;
}

/** Execution statistics result type */
export interface ExecutionStats {
  totalExecutions: number;
  successCount: number;
  errorCount: number;
  averageDuration: number;
  lastExecution?: ExecutionResult;
}

/** Execution service interface */
export interface ExecutionService {
  executeWorkflow: (
    workflowId: string,
    data: {
      nodes: unknown[];
      connections: unknown[];
      inputs: unknown;
    },
    tenantId: string
  ) => Promise<ExecutionResult>;
  cancelExecution: (
    executionId: string
  ) => Promise<void>;
  getExecutionDetails: (
    executionId: string
  ) => Promise<ExecutionResult | null>;
  getExecutionStats: (
    workflowId: string,
    tenantId: string
  ) => Promise<ExecutionStats>;
  getExecutionHistory: (
    workflowId: string,
    tenantId: string,
    limit: number
  ) => Promise<ExecutionResult[]>;
}

/** Redux actions interface */
export interface ExecutionActions {
  startExecution: (
    payload: ExecutionResult
  ) => any;
  endExecution: (
    payload: ExecutionResult
  ) => any;
}

/** Options for useExecution hook */
export interface UseExecutionOptions {
  /** Redux dispatch function */
  dispatch: (action: unknown) => void;
  /** Current execution from Redux state */
  currentExecution: ExecutionResult | null;
  /** Execution history from Redux state */
  executionHistory: ExecutionResult[];
  /** Execution service instance */
  executionService: ExecutionService;
  /** Redux action creators */
  actions: ExecutionActions;
}
