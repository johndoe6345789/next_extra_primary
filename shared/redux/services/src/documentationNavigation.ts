/**
 * Documentation navigation helpers
 * Breadcrumbs, navigation tree, category check
 */

import type {
  DocCategory, DocPage, DocSection,
  DocumentationIndex,
} from './documentationTypes';

/** Get breadcrumbs for a page */
export function getBreadcrumbs(
  idx: DocumentationIndex,
  pageId: string
): Array<{ id: string; title: string }> {
  const page = idx.pages[pageId];
  if (!page) return [];
  const sec = idx.sections.find(
    (s) => s.category === page.category
  );
  if (!sec) {
    return [{ id: pageId, title: page.title }];
  }
  return [
    { id: sec.id, title: sec.title },
    { id: pageId, title: page.title },
  ];
}

/** Get navigation tree */
export function getNavigationTree(
  idx: DocumentationIndex
): Array<{
  section: DocSection; pages: DocPage[];
}> {
  return idx.sections.map((sec) => ({
    section: sec,
    pages: sec.pages
      .map((id) => idx.pages[id])
      .filter((p): p is DocPage => !!p),
  }));
}

/** Check if category exists */
export function hasCategory(
  idx: DocumentationIndex, cat: DocCategory
): boolean {
  return idx.sections.some(
    (s) => s.category === cat
  );
}
