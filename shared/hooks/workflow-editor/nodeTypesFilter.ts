/**
 * Node type filtering/search logic
 */

import { useMemo, useState } from 'react';
import type {
  NodeTypeDefinition,
} from './nodeTypesTypes';

/** Hook for filtering node types */
export function useNodeTypeFilter(
  nodeTypes: NodeTypeDefinition[]
) {
  const [searchQuery, setSearchQuery] =
    useState('');
  const [selectedLanguage, setSelectedLanguage] =
    useState<string | null>(null);

  const filteredNodeTypes = useMemo(() => {
    let f = nodeTypes;
    if (selectedLanguage) {
      f = f.filter(
        (n) => n.language === selectedLanguage
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      f = f.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.description
            .toLowerCase()
            .includes(q) ||
          n.category
            .toLowerCase()
            .includes(q) ||
          n.language
            ?.toLowerCase()
            .includes(q)
      );
    }
    return f;
  }, [nodeTypes, searchQuery, selectedLanguage]);

  return {
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    filteredNodeTypes,
  };
}
