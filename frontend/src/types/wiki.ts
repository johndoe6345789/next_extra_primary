/**
 * Wiki domain types.
 * @module types/wiki
 */

/** A wiki tree node for sidebar navigation. */
export interface WikiTreeNode {
  slug: string;
  title: string;
  children?: WikiTreeNode[];
}

/** A rendered wiki page. */
export interface WikiPage {
  slug: string;
  title: string;
  contentHtml: string;
  updatedAt?: string;
  updatedBy?: string;
  revision?: number;
}

/** A wiki revision meta entry. */
export interface WikiRevision {
  id: string;
  revision: number;
  author?: string;
  createdAt: string;
  summary?: string;
}
