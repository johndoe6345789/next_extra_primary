/**
 * API fetch logic for useNodeTypes
 */

import type {
  NodeCategory,
  NodeTypeDefinition,
} from './nodeTypesTypes';
import { DEFAULT_CATEGORIES } from './nodeTypesData';

/** Result of fetching plugins API */
export interface PluginApiResult {
  categories: Record<string, NodeCategory>;
  nodeTypes: NodeTypeDefinition[];
  languages: string[];
  nodesByLanguage: Record<
    string,
    NodeTypeDefinition[]
  >;
  languageHealth: Record<string, boolean>;
}

/**
 * Fetch plugin data from the API endpoint.
 * Returns parsed categories, nodes, and
 * language grouping data.
 */
export async function fetchPlugins(
  endpoint: string
): Promise<PluginApiResult> {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch plugins: ` +
        response.statusText
    );
  }

  const data = await response.json();

  const cats: Record<string, NodeCategory> = {
    ...DEFAULT_CATEGORIES,
  };
  if (
    data.categories &&
    Array.isArray(data.categories)
  ) {
    data.categories.forEach(
      (cat: NodeCategory) => {
        cats[cat.id] = cat;
      }
    );
  }

  const nodeTypes: NodeTypeDefinition[] =
    data.nodes && Array.isArray(data.nodes)
      ? data.nodes
      : [];

  const languages: string[] =
    data.languages && Array.isArray(data.languages)
      ? data.languages
      : [];

  const nodesByLanguage =
    data.nodesByLanguage &&
    typeof data.nodesByLanguage === 'object'
      ? data.nodesByLanguage
      : {};

  const languageHealth =
    data.languageHealth &&
    typeof data.languageHealth === 'object'
      ? data.languageHealth
      : {};

  return {
    categories: cats,
    nodeTypes,
    languages,
    nodesByLanguage,
    languageHealth,
  };
}
