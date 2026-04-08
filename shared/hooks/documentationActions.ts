/**
 * Action callbacks for useDocumentation
 */

import { useCallback } from 'react';
import type {
  DocCategory,
  DocumentationService,
  DocumentationActions,
} from './documentationTypes';

/** Create documentation action callbacks */
export function useDocActions(
  dispatch: (action: unknown) => void,
  documentationService: DocumentationService,
  helpState: { history: unknown[] },
  actions: DocumentationActions
) {
  const openHelpModal = useCallback(
    (pageId?: string, category?: DocCategory) => {
      dispatch(actions.openHelp({ pageId, category }));
    },
    [dispatch, actions]
  );

  const closeHelpModal = useCallback(() => {
    dispatch(actions.closeHelp());
  }, [dispatch, actions]);

  const goToPage = useCallback(
    (pageId: string) => {
      dispatch(actions.navigateToPage(pageId));
    },
    [dispatch, actions]
  );

  const switchCategory = useCallback(
    (category: DocCategory | null) => {
      dispatch(actions.setCategory(category));
    },
    [dispatch, actions]
  );

  const search = useCallback(
    (query: string) => {
      dispatch(actions.setSearchQuery(query));
      if (query.length >= 2) {
        const results = documentationService.search(query);
        dispatch(actions.setSearchResults(results.map((r) => r.id)));
      } else {
        dispatch(actions.setSearchResults([]));
      }
    },
    [dispatch, documentationService, actions]
  );

  const goBackInHistory = useCallback(() => {
    dispatch(actions.goBack());
  }, [dispatch, actions]);

  const clearSearchResults = useCallback(() => {
    dispatch(actions.clearSearch());
  }, [dispatch, actions]);

  const canGoBack = helpState.history.length > 1;

  return {
    openHelpModal, closeHelpModal, goToPage,
    switchCategory, search, goBackInHistory,
    clearSearchResults, canGoBack,
  };
}
