/**
 * useNodeTypes Hook
 * Loads and manages node type definitions
 */

import { useState } from 'react';
import type {
  UseNodeTypesReturn,
  UseNodeTypesOptions,
} from './nodeTypesTypes';
import {
  DEFAULT_CATEGORIES,
  FALLBACK_NODE_TYPES,
} from './nodeTypesData';
import {
  useNodeTypeRegistration,
  useNodeTypeQueries,
} from './nodeTypesRegistration';
import {
  useNodeTypeCategories,
} from './nodeTypesCategories';
import {
  useNodeTypeFilter,
} from './nodeTypesFilter';
import {
  useNodeTypeLoader,
} from './nodeTypesLoader';

export type {
  NodeTypeDefinition,
  NodeCategory,
  UseNodeTypesReturn,
  UseNodeTypesOptions,
} from './nodeTypesTypes';

/** Hook for workflow node type management */
export function useNodeTypes(
  opts: UseNodeTypesOptions = {}
): UseNodeTypesReturn {
  const {
    initialNodeTypes = FALLBACK_NODE_TYPES,
    initialCategories = DEFAULT_CATEGORIES,
    autoExpandCategories = false,
    loadFromAPI = true,
    apiEndpoint = '/api/plugins',
  } = opts;

  const [nodeTypes, setNodeTypes] =
    useState(initialNodeTypes);

  const catOps = useNodeTypeCategories(
    initialCategories,
    autoExpandCategories
  );
  const reg =
    useNodeTypeRegistration(setNodeTypes);
  const queries = useNodeTypeQueries(nodeTypes);
  const filter = useNodeTypeFilter(nodeTypes);
  const loader = useNodeTypeLoader(
    apiEndpoint,
    loadFromAPI,
    autoExpandCategories,
    setNodeTypes,
    catOps.mergeCategories
  );

  return {
    nodeTypes,
    categories: catOps.categories,
    ...loader,
    ...filter,
    expandedCategories:
      catOps.expandedCategories,
    toggleCategory: catOps.toggleCategory,
    expandAllCategories:
      catOps.expandAllCategories,
    collapseAllCategories:
      catOps.collapseAllCategories,
    ...queries,
    ...reg,
    refreshFromAPI: loader.refreshFromAPI,
  };
}
