/**
 * Documentation service type definitions
 */

/** Documentation content block types */
export type DocContentType =
  | 'text' | 'heading' | 'code' | 'list'
  | 'image' | 'video' | 'table'
  | 'callout' | 'step' | 'example';

/** Documentation categories */
export type DocCategory =
  | 'getting-started' | 'canvas'
  | 'workflows' | 'settings'
  | 'keyboard-shortcuts'
  | 'troubleshooting'
  | 'faq' | 'best-practices';

/** Content block in documentation */
export interface DocContentBlock {
  type: DocContentType;
  content: string;
  title?: string;
  level?: number;
  language?: string;
  icon?: string;
  variant?:
    | 'info' | 'warning' | 'error' | 'success';
  items?: string[];
  columns?: string[];
  rows?: (string | number)[][];
  subtext?: string;
}

/** Single documentation page */
export interface DocPage {
  id: string;
  title: string;
  category: DocCategory;
  description?: string;
  content: DocContentBlock[];
  relatedPages?: string[];
  keywords?: string[];
  lastUpdated?: number;
  difficulty?:
    | 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime?: number;
}

/** Documentation section */
export interface DocSection {
  id: string;
  title: string;
  description?: string;
  category: DocCategory;
  pages: string[];
  icon?: string;
  order?: number;
}

/** Search index entry */
export interface SearchIndexEntry {
  pageId: string;
  title: string;
  category: DocCategory;
  content: string;
  keywords: string[];
}

/** Complete documentation structure */
export interface DocumentationIndex {
  version: string;
  lastUpdated: number;
  sections: DocSection[];
  pages: Record<string, DocPage>;
  searchIndex?: SearchIndexEntry[];
}
