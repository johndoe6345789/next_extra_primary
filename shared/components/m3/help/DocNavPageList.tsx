'use client';

import React from 'react';
import { testId }
  from '../../utils/accessibility';
import type { NavPage } from './docNavTypes';

/** Props for DocNavPageList. */
export interface DocNavPageListProps {
  sectionId: string;
  pages: NavPage[];
  currentPageId?: string | null;
  onPageSelect: (id: string) => void;
}

/** List of doc pages within a section. */
export function DocNavPageList({
  sectionId, pages, currentPageId,
  onPageSelect,
}: DocNavPageListProps) {
  return (
    <ul id={`section-${sectionId}`}
      style={{
        listStyle: 'none', padding: 0,
        margin: 0, paddingLeft: '16px',
      }}>
      {pages.map((page) => {
        const active =
          currentPageId === page.id;
        return (
          <li key={page.id}
            style={{ marginBottom: '4px' }}>
            <button
              onClick={() =>
                onPageSelect(page.id)}
              data-testid={
                testId.navLink(page.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '6px 8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                color: 'inherit',
                borderLeft: active
                  ? '3px solid #1976d2'
                  : '3px solid transparent',
                backgroundColor: active
                  ? '#f5f5f5'
                  : 'transparent',
              }}>
              <div style={{
                fontWeight: active
                  ? 500 : 400,
              }}>{page.title}</div>
              {page.estimatedReadTime && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#999',
                  marginTop: '2px',
                }}>
                  {page.estimatedReadTime} min
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
