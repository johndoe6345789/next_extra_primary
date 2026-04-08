/**
 * Type definitions for useDocumentation hook
 */

/** Documentation category types */
export type DocCategory =
  | 'getting-started'
  | 'tutorials'
  | 'reference'
  | 'api'
  | 'guides'
  | string;

/** Documentation page interface */
export interface DocPage {
  id: string;
  title: string;
  category: DocCategory;
  content: string;
  tags?: string[];
  relatedPages?: string[];
}

/** Documentation navigation tree node */
export interface DocNavNode {
  id: string;
  title: string;
  children?: DocNavNode[];
}

/** Documentation service interface */
export interface DocumentationService {
  getPage: (id: string) => DocPage | null;
  getNavigationTree: () => DocNavNode[];
  getPagesByCategory: (
    category: DocCategory
  ) => DocPage[];
  search: (query: string) => DocPage[];
  getRelatedPages: (
    pageId: string
  ) => DocPage[];
  getBreadcrumbs: (
    pageId: string
  ) => { id: string; title: string }[];
  getStats: () => {
    totalPages: number;
    categories: number;
  };
}

export type {
  DocumentationState,
  DocumentationActions,
  UseDocumentationOptions,
} from './documentationStateTypes'
