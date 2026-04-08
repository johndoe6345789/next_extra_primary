'use client';

import React from 'react';
import { testId }
  from '../../utils/accessibility';
import type { DocNavSectionProps }
  from './docNavTypes';
import { DocNavPageList }
  from './DocNavPageList';

export type { NavPage, DocNavSectionProps }
  from './docNavTypes';

/** Collapsible documentation nav section. */
export function DocNavSection({
  sectionId, sectionTitle, sectionIcon,
  isExpanded, pages, currentPageId,
  onToggle, onPageSelect,
}: DocNavSectionProps) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <button
        onClick={() => onToggle(sectionId)}
        aria-expanded={isExpanded}
        aria-controls={
          `section-${sectionId}`}
        data-testid={testId.button(
          `section-${sectionId}`)}
        style={{
          width: '100%', display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px', background: 'none',
          border: 'none', color: '#1976d2',
          fontWeight: 600, cursor: 'pointer',
          fontSize: 'inherit',
          textAlign: 'left',
        }}>
        <span style={{
          display: 'flex',
          alignItems: 'center', gap: '8px',
        }}>
          <span>{sectionIcon}</span>
          <span>{sectionTitle}</span>
        </span>
        <span>{isExpanded
          ? '\u25BC' : '\u25B6'}</span>
      </button>
      {isExpanded && (
        <DocNavPageList
          sectionId={sectionId}
          pages={pages}
          currentPageId={currentPageId}
          onPageSelect={onPageSelect} />
      )}
    </div>
  );
}

export default DocNavSection;
