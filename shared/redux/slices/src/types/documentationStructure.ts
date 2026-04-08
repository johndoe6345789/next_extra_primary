/**
 * Documentation structural types (sections, index)
 */

import type {
  DocCategory,
  DocPage
} from './documentationContent';

/**
 * Documentation section (collection of pages)
 */
export interface DocSection {
  id: string;
  title: string;
  description?: string;
  category: DocCategory;
  pages: string[];
  icon?: string;
  order?: number;
}

/**
 * Complete documentation structure
 */
export interface DocumentationIndex {
  version: string;
  lastUpdated: number;
  sections: DocSection[];
  pages: Record<string, DocPage>;
  searchIndex?: SearchIndexEntry[];
}

/**
 * Search index entry for full-text search
 */
export interface SearchIndexEntry {
  pageId: string;
  title: string;
  category: DocCategory;
  content: string;
  keywords: string[];
}
