/**
 * Barrel export for the JSON renderer system.
 * @module shared/components/json-renderer
 */

export { default as JsonRenderer } from './JsonRenderer';
export { useJsonPage } from './useJsonPage';
export {
  registerComponent,
  registerHook,
  getComponent,
  getHook,
} from './registry';
export type {
  ComponentNode,
  HookBinding,
  PageDefinition,
  HookFn,
  ComponentMap,
  HookMap,
} from './types';
