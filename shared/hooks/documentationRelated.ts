/**
 * Related pages and breadcrumb selectors
 * for useDocumentation
 */

import { useMemo } from 'react';
import type {
  DocPage,
  DocumentationService,
} from './documentationTypes';

/** Get related pages for current page */
export function useRelatedPages(
  currentPage: DocPage | null,
  service: DocumentationService
) {
  return useMemo(
    () =>
      currentPage
        ? service.getRelatedPages(
            currentPage.id
          )
        : [],
    [currentPage, service]
  );
}

/** Get breadcrumbs for current page */
export function useBreadcrumbs(
  currentPage: DocPage | null,
  service: DocumentationService
) {
  return useMemo(
    () =>
      currentPage
        ? service.getBreadcrumbs(
            currentPage.id
          )
        : [],
    [currentPage, service]
  );
}
