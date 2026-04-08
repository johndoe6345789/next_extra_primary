/**
 * useDocumentation Hook
 * Documentation system integration
 */

import { useMemo } from 'react';
import type { UseDocumentationOptions } from './documentationTypes';
import {
  useCurrentPage, useNavTree,
  useSectionPages, useSearchPages,
  useHistoryPages, useRelatedPages,
  useBreadcrumbs,
} from './documentationData';
import { useDocActions } from './documentationActions';

export type {
  DocCategory, DocPage, DocNavNode,
  DocumentationService, DocumentationState,
  DocumentationActions, UseDocumentationOptions,
} from './documentationTypes';

/** Hook for documentation integration */
export function useDocumentation(
  options: UseDocumentationOptions
) {
  const { dispatch, helpState, documentationService, actions } = options;

  const currentPage = useCurrentPage(helpState, documentationService);
  const navigationTree = useNavTree(documentationService);
  const currentSectionPages = useSectionPages(helpState, documentationService);
  const searchResults = useSearchPages(helpState, documentationService);
  const historyPages = useHistoryPages(helpState, documentationService);
  const relatedPages = useRelatedPages(currentPage, documentationService);
  const breadcrumbs = useBreadcrumbs(currentPage, documentationService);
  const stats = useMemo(() => documentationService.getStats(), [documentationService]);

  const acts = useDocActions(dispatch, documentationService, helpState, actions);

  return {
    isOpen: helpState.isOpen,
    currentPage,
    currentCategory: helpState.currentCategory,
    searchQuery: helpState.searchQuery,
    searchResults,
    history: historyPages,
    navigationTree,
    currentSectionPages,
    relatedPages,
    breadcrumbs,
    ...acts,
    documentationService,
    stats,
  };
}

export default useDocumentation;
