/**
 * NodePalette Component
 * Right sidebar with search and categorized
 * nodes.
 */

'use client';

import React from 'react';
import {
  NODE_CATEGORIES, NODE_TYPES,
} from './node-definitions';
import { PaletteHeader } from './PaletteHeader';
import { PaletteCategories }
  from './PaletteCategories';
import { PaletteSearchResults }
  from './PaletteSearchResults';
import type { NodePaletteProps }
  from './nodePaletteTypes';
import styles from '../../scss/atoms/workflow-editor.module.scss';

export type { NodePaletteProps }
  from './nodePaletteTypes';

/** Right sidebar palette for adding nodes. */
export function NodePalette({
  nodeSearch, onSearchChange,
  expandedCategories, onToggleCategory,
  onExpandAll, onCollapseAll, onDragStart,
  nodeTypes, categories,
  languages = [], languageHealth = {},
  selectedLanguage = null, onLanguageChange,
  isLoading = false,
}: NodePaletteProps): React.ReactElement {
  const unhealthy = languages.filter(
    (l) => languageHealth[l] === false);
  const allTypes = nodeTypes || NODE_TYPES;
  const allCats = categories || NODE_CATEGORIES;
  const filtered = allTypes.filter((n) => {
    if (selectedLanguage && n.language
      && n.language !== selectedLanguage)
      return false;
    if (!nodeSearch.trim()) return true;
    const q = nodeSearch.toLowerCase();
    return (
      n.name.toLowerCase().includes(q)
      || n.description.toLowerCase().includes(q)
      || n.category.toLowerCase().includes(q)
      || (n.language?.toLowerCase().includes(q))
    );
  });
  return (
    <aside className={styles.palette}>
      <PaletteHeader
        isLoading={isLoading}
        unhealthyLanguages={unhealthy}
        nodeSearch={nodeSearch}
        onSearchChange={onSearchChange}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
        languages={languages}
        languageHealth={languageHealth}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
        filteredCount={filtered.length} />
      {nodeSearch.trim() ? (
        <PaletteSearchResults
          filtered={filtered}
          onDragStart={onDragStart} />
      ) : (
        <PaletteCategories
          categories={allCats}
          nodeTypes={filtered}
          expandedCategories={
            expandedCategories}
          onToggleCategory={onToggleCategory}
          onDragStart={onDragStart} />
      )}
    </aside>
  );
}
