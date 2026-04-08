/**
 * Documentation query functions
 * Core lookups: pages, sections, categories
 */

import type {
  DocCategory, DocPage, DocSection,
  DocumentationIndex,
} from './documentationTypes';

export {
  getPagesByDifficulty, getPagesByReadTime,
} from './documentationFilterQueries';

/** Get all sections sorted by order */
export function getSections(
  idx: DocumentationIndex
): DocSection[] {
  return idx.sections.sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
}

/** Get section by category */
export function getSectionByCategory(
  idx: DocumentationIndex,
  category: DocCategory
): DocSection | undefined {
  return idx.sections.find(
    (s) => s.category === category
  );
}

/** Get a page by ID */
export function getPage(
  idx: DocumentationIndex,
  pageId: string
): DocPage | undefined {
  return idx.pages[pageId];
}

/** Get pages in a section */
export function getPagesBySection(
  idx: DocumentationIndex,
  sectionId: string
): DocPage[] {
  const sec = idx.sections.find(
    (s) => s.id === sectionId
  );
  if (!sec) return [];
  return sec.pages
    .map((id) => idx.pages[id])
    .filter((p): p is DocPage => !!p);
}

/** Get pages by category */
export function getPagesByCategory(
  idx: DocumentationIndex,
  category: DocCategory
): DocPage[] {
  return Object.values(idx.pages).filter(
    (p): p is DocPage =>
      p.category === category
  );
}

/** Get related pages for a page */
export function getRelatedPages(
  idx: DocumentationIndex,
  pageId: string
): DocPage[] {
  const page = idx.pages[pageId];
  if (!page?.relatedPages) return [];
  return page.relatedPages
    .map((id) => idx.pages[id])
    .filter((p): p is DocPage => !!p);
}
