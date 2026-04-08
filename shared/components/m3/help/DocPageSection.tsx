import React from 'react';
import { DocPage } from '../../types/documentation';
import { testId } from '../../utils/accessibility';
import { ContentBlock } from './blocks/ContentBlock';
import { DocPageHeader } from './DocPageHeader';
import { RelatedPages } from './RelatedPages';

interface DocPageSectionProps {
  page: DocPage;
  isLast: boolean;
  onPageSelect?: (pageId: string) => void;
}

/**
 * DocPageSection - Renders a single doc page
 * with header, content blocks, and related.
 */
export const DocPageSection: React.FC<
  DocPageSectionProps
> = ({ page, isLast, onPageSelect }) => (
  <section
    data-testid={testId.section(
      `doc-page-${page.id}`
    )}
    style={{
      marginBottom: isLast ? 0 : '32px',
    }}
  >
    <DocPageHeader page={page} />
    <hr
      style={{
        border: 'none',
        borderTop: '1px solid #e0e0e0',
        margin: '16px 0',
      }}
    />
    <div style={{ margin: '16px 0' }}>
      {page.content.map((block, idx) => (
        <ContentBlock key={idx} block={block} />
      ))}
    </div>
    {page.relatedPages &&
      page.relatedPages.length > 0 && (
        <RelatedPages
          ids={page.relatedPages}
          onPageSelect={onPageSelect}
        />
      )}
  </section>
);

export default DocPageSection;
