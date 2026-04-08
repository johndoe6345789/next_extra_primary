/**
 * API loading logic for useNodeTypes
 */

import {
  useState,
  useCallback,
  useEffect,
} from 'react';
import type {
  NodeTypeDefinition,
} from './nodeTypesTypes';
import { fetchPlugins } from './nodeTypesApi';

/** Hook for loading node types from API */
export function useNodeTypeLoader(
  apiEndpoint: string,
  loadFromAPI: boolean,
  autoExpandCategories: boolean,
  setNodeTypes: (nt: NodeTypeDefinition[]) => void,
  mergeCategories: (
    cats: Record<string, unknown>,
    autoExpand: boolean
  ) => void
) {
  const [isLoading, setIsLoading] =
    useState(loadFromAPI);
  const [error, setError] = useState<
    string | null
  >(null);
  const [languages, setLanguages] = useState<
    string[]
  >([]);
  const [nodesByLanguage, setNodesByLang] =
    useState<
      Record<string, NodeTypeDefinition[]>
    >({});
  const [languageHealth, setLangHealth] =
    useState<Record<string, boolean>>({});

  const refreshFromAPI =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const r =
          await fetchPlugins(apiEndpoint);
        mergeCategories(
          r.categories,
          autoExpandCategories
        );
        setNodeTypes(r.nodeTypes);
        setLanguages(r.languages);
        setNodesByLang(r.nodesByLanguage);
        setLangHealth(r.languageHealth);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : 'Failed to load plugins';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    }, [
      apiEndpoint,
      autoExpandCategories,
      mergeCategories,
      setNodeTypes,
    ]);

  useEffect(() => {
    if (loadFromAPI) refreshFromAPI();
  }, [loadFromAPI, refreshFromAPI]);

  return {
    isLoading,
    error,
    languages,
    nodesByLanguage,
    languageHealth,
    refreshFromAPI,
  };
}
