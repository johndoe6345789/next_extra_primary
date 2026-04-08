/**
 * Documentation content block types
 */

/** Documentation content block types */
export type DocContentType =
  | 'text'
  | 'heading'
  | 'code'
  | 'list'
  | 'image'
  | 'video'
  | 'table'
  | 'callout'
  | 'step'
  | 'example';

/** Documentation categories */
export type DocCategory =
  | 'getting-started'
  | 'canvas'
  | 'workflows'
  | 'settings'
  | 'keyboard-shortcuts'
  | 'troubleshooting'
  | 'faq'
  | 'best-practices';

/**
 * Content block representing a documentation section
 */
export interface DocContentBlock {
  type: DocContentType;
  content: string;
  title?: string;
  level?: number;
  language?: string;
  icon?: string;
  variant?: 'info' | 'warning' | 'error' | 'success';
  items?: string[];
  columns?: string[];
  rows?: (string | number)[][];
  subtext?: string;
}

/**
 * Single documentation page/article
 */
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
    | 'beginner'
    | 'intermediate'
    | 'advanced';
  estimatedReadTime?: number;
}

export type {
  DocSection,
  DocumentationIndex,
  SearchIndexEntry,
} from './documentationStructure';
