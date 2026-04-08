/**
 * DocContentRenderer Component
 * Renders documentation pages and their
 * content blocks.
 */

import React from 'react';
import { DocPage } from '../../types/documentation';
import { testId } from '../../utils/accessibility';
import { DocPageSection } from './DocPageSection';

interface DocContentRendererProps {
  pages: (DocPage | undefined)[];
  isSearchResults?: boolean;
  onPageSelect?: (pageId: string) => void;
}

/**
 * Renders a list of documentation pages,
 * filtering out undefined entries.
 */
export const DocContentRenderer: React.FC<
  DocContentRendererProps
> = ({ pages, onPageSelect }) => {
  const valid = pages.filter(
    (p): p is DocPage => !!p
  );

  if (!valid.length) {
    return (
      <p
        style={{ color: '#666' }}
        data-testid={testId.text('no-content')}
      >
        No documentation available
      </p>
    );
  }

  return (
    <main
      role="main"
      aria-label="Documentation content"
    >
      {valid.map((page, idx) => (
        <DocPageSection
          key={page.id}
          page={page}
          isLast={idx === valid.length - 1}
          onPageSelect={onPageSelect}
        />
      ))}
    </main>
  );
};

export default DocContentRenderer;
