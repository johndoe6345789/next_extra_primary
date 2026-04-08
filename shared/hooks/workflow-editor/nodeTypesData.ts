/**
 * Default data for useNodeTypes hook
 */

import type {
  NodeCategory,
  NodeTypeDefinition,
} from './nodeTypesTypes';

/** Helper to build a category */
function cat(
  id: string,
  name: string,
  color: string,
  icon: string
): NodeCategory {
  return { id, name, color, icon };
}

/** Default categories (n8n style fallback) */
export const DEFAULT_CATEGORIES: Record<
  string,
  NodeCategory
> = {
  triggers: cat(
    'triggers', 'Triggers', '#ff6b6b', 'zap'
  ),
  actions: cat(
    'actions', 'Actions', '#4ecdc4', 'play'
  ),
  logic: cat(
    'logic', 'Logic', '#45b7d1', 'git-branch'
  ),
  math: cat(
    'math', 'Math', '#f39c12', 'calculator'
  ),
  string: cat(
    'string', 'String', '#9b59b6', 'type'
  ),
  data: cat(
    'data', 'Data', '#96ceb4', 'database'
  ),
  integrations: cat(
    'integrations', 'Integrations',
    '#dda0dd', 'plug'
  ),
  utils: cat(
    'utils', 'Utilities', '#ffeaa7', 'tool'
  ),
  ai: cat('ai', 'AI', '#e74c3c', 'cpu'),
  backend: cat(
    'backend', 'Backend', '#3498db', 'server'
  ),
};

/** Minimal fallback node types */
export const FALLBACK_NODE_TYPES: NodeTypeDefinition[] = [
  {
    id: 'trigger.manual',
    type: 'triggers',
    category: 'triggers',
    name: 'Manual Trigger',
    icon: 'play',
    color: '#ff6b6b',
    description: 'Start workflow manually',
    inputs: [],
    outputs: ['main'],
    defaultConfig: {},
    language: 'ts',
  },
  {
    id: 'logic.if',
    type: 'logic',
    category: 'logic',
    name: 'If',
    icon: 'git-branch',
    color: '#45b7d1',
    description: 'Conditional branching',
    inputs: ['main'],
    outputs: ['true', 'false'],
    defaultConfig: { condition: '' },
    language: 'ts',
  },
];
