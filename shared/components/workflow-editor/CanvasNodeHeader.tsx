/**
 * CanvasNodeHeader - header portion of a
 * workflow canvas node with icon and title.
 */

'use client';

import React from 'react';
import { getNodeIcon } from './icons';
import styles
  from '../../scss/atoms/workflow-editor.module.scss';

/** Props for CanvasNodeHeader. */
export interface CanvasNodeHeaderProps {
  name: string;
  color: string;
  icon?: string;
}

/** Node header with icon and title. */
export function CanvasNodeHeader({
  name, color, icon,
}: CanvasNodeHeaderProps) {
  return (
    <div className={styles.canvasNodeHeader}
      style={{ backgroundColor: color }}>
      <svg width="16" height="16"
        viewBox="0 0 24 24" fill="white">
        <path d={
          getNodeIcon(icon || 'code')
        } />
      </svg>
      <h4 className={styles.canvasNodeTitle}>
        {name}
      </h4>
    </div>
  );
}
