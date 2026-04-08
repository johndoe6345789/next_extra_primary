/**
 * Documentation service interface definition
 */

import type {
  DocCategory, DocPage, DocSection,
  DocumentationIndex,
} from './documentationTypes';

/** Documentation service public API */
export interface IDocumentationService {
  /** Get the complete documentation index */
  getIndex(): DocumentationIndex;
  /** Get all sections sorted by order */
  getSections(): DocSection[];
  /** Get section by category */
  getSectionByCategory(
    category: DocCategory
  ): DocSection | undefined;
  /** Get a specific page by ID */
  getPage(pageId: string): DocPage | undefined;
  /** Get all pages in a section */
  getPagesBySection(
    sectionId: string
  ): DocPage[];
  /** Get pages by category */
  getPagesByCategory(
    category: DocCategory
  ): DocPage[];
  /** Search documentation by query */
  search(query: string): DocPage[];
  /** Get related pages for a given page */
  getRelatedPages(pageId: string): DocPage[];
  /** Get pages by difficulty level */
  getPagesByDifficulty(
    difficulty:
      | 'beginner' | 'intermediate' | 'advanced'
  ): DocPage[];
  /** Get pages by read time range */
  getPagesByReadTime(
    minTime: number, maxTime: number
  ): DocPage[];
  /** Get recently updated pages */
  getRecentPages(limit?: number): DocPage[];
  /** Get breadcrumb navigation */
  getBreadcrumbs(
    pageId: string
  ): Array<{ id: string; title: string }>;
  /** Get full navigation tree */
  getNavigationTree(): Array<{
    section: DocSection; pages: DocPage[];
  }>;
  /** Check if category has docs */
  hasCategory(category: DocCategory): boolean;
  /** Get documentation statistics */
  getStats(): {
    totalPages: number;
    totalSections: number;
    totalWords: number;
    averageReadTime: number;
    lastUpdated: number;
  };
}
