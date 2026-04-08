/**
 * Selectors for the nodes slice
 */

import type { NodesState } from './nodesSlice';

/** Select the full node registry */
export const selectRegistry = (
  state: { nodes: NodesState }
) => state.nodes.registry;

/** Select all node templates */
export const selectTemplates = (
  state: { nodes: NodesState }
) => state.nodes.templates;

/** Select available categories */
export const selectCategories = (
  state: { nodes: NodesState }
) => state.nodes.categories;

/** Select loading state */
export const selectNodesIsLoading = (
  state: { nodes: NodesState }
) => state.nodes.isLoading;

/** Select error state */
export const selectNodesError = (
  state: { nodes: NodesState }
) => state.nodes.error;
