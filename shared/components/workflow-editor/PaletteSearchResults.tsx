/**
 * PaletteSearchResults Component
 * Filtered node search results list
 */

'use client';

import React from 'react';
import { PaletteNode } from './PaletteNode';
import type { NodeType }
  from './node-definitions';
import styles from '../../scss/atoms/workflow-editor.module.scss';

export interface PaletteSearchResultsProps {
  filtered: NodeType[];
  onDragStart: (
    e: React.DragEvent, type: NodeType
  ) => void;
}

/** Renders filtered node search results. */
export function PaletteSearchResults({
  filtered, onDragStart,
}: PaletteSearchResultsProps) {
  return (
    <div className={styles.categoryContent}>
      {filtered.length === 0 ? (
        <p style={{
          padding: 16,
          textAlign: 'center',
          color:
            'var(--mat-sys-on-surface-variant)',
        }}>
          No nodes found
        </p>
      ) : (
        filtered.map((nt) => (
          <PaletteNode key={nt.id}
            nodeType={nt}
            onDragStart={onDragStart} />
        ))
      )}
    </div>
  );
}
