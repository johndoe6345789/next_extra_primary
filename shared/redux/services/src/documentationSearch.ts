/**
 * Documentation search helpers
 */

import type {
  DocPage, DocumentationIndex,
} from './documentationTypes';

export { getDocStats } from
  './documentationStats';
export {
  getBreadcrumbs, getNavigationTree,
  hasCategory,
} from './documentationNavigation';

/** Search documentation by query string */
export function searchDocs(
  idx: DocumentationIndex,
  query: string
): DocPage[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return Object.values(idx.pages).filter(
    (page): page is DocPage => {
      if (page.title.toLowerCase().includes(q))
        return true;
      if (page.description?.toLowerCase()
        .includes(q)) return true;
      if (page.keywords?.some(
        (kw) => kw.toLowerCase().includes(q)
      )) return true;
      return page.content.some((block) => {
        if (typeof block.content === 'string') {
          return block.content.toLowerCase()
            .includes(q);
        }
        if (block.items) {
          return block.items.some(
            (item) => item.toLowerCase()
              .includes(q)
          );
        }
        return false;
      });
    }
  );
}

/** Get recently updated pages */
export function getRecentPages(
  idx: DocumentationIndex, limit = 5
): DocPage[] {
  return Object.values(idx.pages)
    .filter((p): p is DocPage => !!p.lastUpdated)
    .sort((a, b) =>
      (b.lastUpdated || 0) -
      (a.lastUpdated || 0))
    .slice(0, limit);
}
