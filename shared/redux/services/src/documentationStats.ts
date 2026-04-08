/**
 * Documentation statistics
 */

import type {
  DocPage, DocumentationIndex,
} from './documentationTypes';

/** Get documentation statistics */
export function getDocStats(
  idx: DocumentationIndex
) {
  const pages = Object.values(idx.pages)
    .filter((p): p is DocPage => !!p);
  const totalWords = pages.reduce(
    (sum, page) =>
      sum + page.content.reduce(
        (ps, block) => {
          if (
            typeof block.content === 'string'
          ) {
            return ps +
              block.content
                .split(/\s+/).length;
          }
          return ps;
        }, 0
      ), 0
  );
  const avgRead = pages.length > 0
    ? Math.round(
      pages.reduce(
        (s, p) => s +
          (p.estimatedReadTime || 0), 0
      ) / pages.length
    ) : 0;
  return {
    totalPages: pages.length,
    totalSections: idx.sections.length,
    totalWords,
    averageReadTime: avgRead,
    lastUpdated: idx.lastUpdated,
  };
}
