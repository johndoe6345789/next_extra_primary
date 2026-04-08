/**
 * Documentation filter query functions
 * Filter by difficulty and read time
 */

import type {
  DocPage, DocumentationIndex,
} from './documentationTypes';

/** Get pages by difficulty */
export function getPagesByDifficulty(
  idx: DocumentationIndex,
  difficulty: string
): DocPage[] {
  return Object.values(idx.pages).filter(
    (p): p is DocPage =>
      p.difficulty === difficulty
  );
}

/** Get pages by read time range */
export function getPagesByReadTime(
  idx: DocumentationIndex,
  minTime: number,
  maxTime: number
): DocPage[] {
  return Object.values(idx.pages).filter(
    (p): p is DocPage =>
      (p.estimatedReadTime || 0) >= minTime &&
      (p.estimatedReadTime || 0) <= maxTime
  );
}
