/**
 * Memoized data selectors for useDocumentation
 */

import { useMemo } from 'react';
import type {
  DocPage,
  DocumentationState,
  DocumentationService,
} from './documentationTypes';

export {
  useRelatedPages,
  useBreadcrumbs,
} from './documentationRelated';

/** Get the current page object */
export function useCurrentPage(
  helpState: DocumentationState,
  service: DocumentationService
): DocPage | null {
  return useMemo(
    () =>
      helpState.currentPageId
        ? service.getPage(
            helpState.currentPageId
          )
        : null,
    [helpState.currentPageId, service]
  );
}

/** Get the navigation tree */
export function useNavTree(
  service: DocumentationService
) {
  return useMemo(
    () => service.getNavigationTree(),
    [service]
  );
}

/** Get pages for current category */
export function useSectionPages(
  helpState: DocumentationState,
  service: DocumentationService
) {
  return useMemo(() => {
    if (!helpState.currentCategory) return [];
    return service.getPagesByCategory(
      helpState.currentCategory
    );
  }, [helpState.currentCategory, service]);
}

/** Resolve search result IDs to pages */
export function useSearchPages(
  helpState: DocumentationState,
  service: DocumentationService
): DocPage[] {
  return useMemo(
    () =>
      helpState.searchResults
        .map((id: string) =>
          service.getPage(id)
        )
        .filter(Boolean) as DocPage[],
    [helpState.searchResults, service]
  );
}

/** Resolve history IDs to pages */
export function useHistoryPages(
  helpState: DocumentationState,
  service: DocumentationService
): DocPage[] {
  return useMemo(
    () =>
      helpState.history
        .map((id: string) =>
          service.getPage(id)
        )
        .filter(Boolean) as DocPage[],
    [helpState.history, service]
  );
}
