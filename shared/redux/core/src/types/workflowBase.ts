/**
 * Core workflow type definitions
 * Node types, workflow structure, and connections
 */

export type {
  Workflow, NodeTemplate,
} from './workflowDefinition';

/**
 * Node parameter definition
 */
export interface NodeParameter {
  name: string;
  type:
    | 'string' | 'number' | 'boolean'
    | 'object' | 'array' | 'select'
    | 'textarea';
  required?: boolean;
  default?: unknown;
  description?: string;
  options?: Array<{
    label: string; value: unknown;
  }>;
  placeholder?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

/**
 * Node type definition (from plugin registry)
 */
export interface NodeType {
  id: string;
  name: string;
  category: string;
  version: string;
  description?: string;
  icon?: string;
  parameters: Record<string, NodeParameter>;
  tags?: string[];
  experimental?: boolean;
  author?: string;
}

/**
 * Workflow node instance
 */
export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  parameters: Record<string, unknown>;
  description?: string;
  disabled?: boolean;
}

/**
 * Connection between nodes
 */
export interface WorkflowConnection {
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
