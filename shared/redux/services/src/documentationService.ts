/**
 * Documentation Service factory
 * Creates a service instance from index data
 */

export type {
  DocContentType, DocCategory,
  DocContentBlock, DocPage, DocSection,
  SearchIndexEntry, DocumentationIndex,
} from './documentationTypes';

export type {
  IDocumentationService,
} from './documentationInterface';

import type { DocumentationIndex } from
  './documentationTypes';
import type { IDocumentationService } from
  './documentationInterface';
import {
  getSections, getSectionByCategory, getPage,
  getPagesBySection, getPagesByCategory,
  getRelatedPages, getPagesByDifficulty,
  getPagesByReadTime,
} from './documentationQueries';
import {
  searchDocs, getRecentPages, getBreadcrumbs,
  getNavigationTree, hasCategory, getDocStats,
} from './documentationSearch';

/**
 * Create a documentation service instance
 * @param docContent - Documentation index data
 */
export function createDocumentationService(
  docContent: DocumentationIndex
): IDocumentationService {
  const idx = docContent;
  return {
    getIndex: () => idx,
    getSections: () => getSections(idx),
    getSectionByCategory: (cat) =>
      getSectionByCategory(idx, cat),
    getPage: (id) => getPage(idx, id),
    getPagesBySection: (id) =>
      getPagesBySection(idx, id),
    getPagesByCategory: (cat) =>
      getPagesByCategory(idx, cat),
    search: (q) => searchDocs(idx, q),
    getRelatedPages: (id) =>
      getRelatedPages(idx, id),
    getPagesByDifficulty: (d) =>
      getPagesByDifficulty(idx, d),
    getPagesByReadTime: (min, max) =>
      getPagesByReadTime(idx, min, max),
    getRecentPages: (limit) =>
      getRecentPages(idx, limit),
    getBreadcrumbs: (id) =>
      getBreadcrumbs(idx, id),
    getNavigationTree: () =>
      getNavigationTree(idx),
    hasCategory: (cat) =>
      hasCategory(idx, cat),
    getStats: () => getDocStats(idx),
  };
}
