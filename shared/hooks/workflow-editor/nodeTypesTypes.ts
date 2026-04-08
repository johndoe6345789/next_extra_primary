/**
 * Types for useNodeTypes hook
 */

/** A single node type definition */
export interface NodeTypeDefinition {
  id: string;
  type: string;
  category: string;
  categoryName?: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  inputs: string[];
  outputs: string[];
  defaultConfig: Record<string, unknown>;
  language?: string;
}

/** A node category */
export interface NodeCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

/** Return type of useNodeTypes */
export interface UseNodeTypesReturn {
  nodeTypes: NodeTypeDefinition[];
  categories: Record<string, NodeCategory>;
  isLoading: boolean;
  error: string | null;
  languages: string[];
  nodesByLanguage: Record<
    string,
    NodeTypeDefinition[]
  >;
  languageHealth: Record<string, boolean>;
  selectedLanguage: string | null;
  setSelectedLanguage: (
    lang: string | null
  ) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredNodeTypes: NodeTypeDefinition[];
  expandedCategories: Record<string, boolean>;
  toggleCategory: (id: string) => void;
  expandAllCategories: () => void;
  collapseAllCategories: () => void;
  getNodeType: (
    id: string
  ) => NodeTypeDefinition | undefined;
  getNodeTypesByCategory: (
    id: string
  ) => NodeTypeDefinition[];
  registerNodeType: (
    n: NodeTypeDefinition
  ) => void;
  registerNodeTypes: (
    n: NodeTypeDefinition[]
  ) => void;
  unregisterNodeType: (id: string) => void;
  refreshFromAPI: () => Promise<void>;
}

/** Options for useNodeTypes */
export interface UseNodeTypesOptions {
  initialNodeTypes?: NodeTypeDefinition[];
  initialCategories?: Record<
    string,
    NodeCategory
  >;
  autoExpandCategories?: boolean;
  loadFromAPI?: boolean;
  apiEndpoint?: string;
}
