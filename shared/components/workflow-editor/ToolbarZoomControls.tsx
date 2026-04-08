/**
 * ToolbarZoomControls Component
 * Zoom in/out/reset controls for the editor
 */

'use client';

import React from 'react';
import { IconButton, Tooltip } from '../m3';
import {
  ZoomInIcon, ZoomOutIcon, ResetIcon,
} from './toolbarIcons';
import styles from '../../scss/atoms/workflow-editor.module.scss';

export interface ToolbarZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

/** Zoom controls for the editor toolbar. */
export function ToolbarZoomControls({
  zoom, onZoomIn, onZoomOut, onZoomReset,
}: ToolbarZoomControlsProps) {
  return (
    <div className={styles.zoomControls}>
      <Tooltip title="Zoom out">
        <IconButton onClick={onZoomOut}>
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <span className={styles.zoomBadge}>
        {Math.round(zoom * 100)}%
      </span>
      <Tooltip title="Zoom in">
        <IconButton onClick={onZoomIn}>
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Reset zoom">
        <IconButton onClick={onZoomReset}>
          <ResetIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
}
