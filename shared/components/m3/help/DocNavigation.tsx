'use client';
/**
 * DocNavigation - Sidebar navigation for
 * documentation categories and pages.
 */

import React, { useState } from 'react';
import { documentationService } from '../../services/documentationService';
import { testId } from '../../utils/accessibility';
import { DocNavSection } from './DocNavSection';

interface DocNavigationProps {
  onPageSelect: (pageId: string) => void;
  currentPageId?: string | null;
}

export const DocNavigation: React.FC<
  DocNavigationProps
> = ({ onPageSelect, currentPageId }) => {
  const [expanded, setExpanded] = useState<
    Set<string>
  >(new Set());

  const tree =
    documentationService.getNavigationTree();

  const handleToggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  return (
    <nav
      role="region"
      aria-label="Documentation sections"
      data-testid={testId.helpNav(
        'documentation'
      )}
    >
      {tree.map(({ section, pages }) => (
        <DocNavSection
          key={section.id}
          sectionId={section.id}
          sectionTitle={section.title}
          sectionIcon={section.icon}
          isExpanded={expanded.has(section.id)}
          pages={pages}
          currentPageId={currentPageId}
          onToggle={handleToggle}
          onPageSelect={onPageSelect}
        />
      ))}
    </nav>
  );
};

export default DocNavigation;
