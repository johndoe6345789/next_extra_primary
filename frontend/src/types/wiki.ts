/**
 * Wiki domain types.
 * @module types/wiki
 */

/** A wiki tree node for sidebar navigation. */
export interface WikiTreeNode {
  /** Database row ID (integer). */
  id: number;
  slug: string;
  title: string;
  depth: number;
  children?: WikiTreeNode[];
}

/** A wiki page with raw markdown body. */
export interface WikiPage {
  slug: string;
  title: string;
  /** Raw markdown source returned by the API. */
  bodyMd: string;
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
