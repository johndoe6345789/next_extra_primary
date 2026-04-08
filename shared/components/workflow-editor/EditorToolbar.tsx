/**
 * EditorToolbar Component
 * Top toolbar with back, name, zoom, save/run
 */

'use client';

import React from 'react';
import { Button, IconButton } from '../m3';
import { BackIcon, PlayIcon }
  from './toolbarIcons';
import { ToolbarZoomControls }
  from './ToolbarZoomControls';
import styles from '../../scss/atoms/workflow-editor.module.scss';

export interface EditorToolbarProps {
  workflowName: string;
  onNameChange: (name: string) => void;
  nodeCount: number;
  connectionCount: number;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onBack: () => void;
  onSave: () => void;
  onRun: () => void;
}

/** Top toolbar for the workflow editor. */
export function EditorToolbar({
  workflowName, onNameChange,
  nodeCount, connectionCount,
  zoom, onZoomIn, onZoomOut, onZoomReset,
  onBack, onSave, onRun,
}: EditorToolbarProps): React.ReactElement {
  return (
    <header className={styles.toolbar}>
      <IconButton onClick={onBack}
        aria-label="Go back">
        <BackIcon />
      </IconButton>
      <div className={styles.toolbarDivider} />
      <input type="text"
        className={styles.propertiesInput}
        style={{
          width: 200, margin: 0,
          padding: '8px 12px',
        }}
        value={workflowName}
        onChange={(e) =>
          onNameChange(e.target.value)} />
      <div className={styles.toolbarSpacer} />
      <span className={styles.toolbarMeta}>
        {nodeCount} nodes |{' '}
        {connectionCount} connections
      </span>
      <div className={styles.toolbarDivider} />
      <ToolbarZoomControls zoom={zoom}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onZoomReset={onZoomReset} />
      <div className={styles.toolbarDivider} />
      <Button variant="outlined"
        onClick={onSave}>
        Save
      </Button>
      <Button variant="contained"
        color="success" onClick={onRun}>
        <PlayIcon />
        <span style={{ marginLeft: 8 }}>
          Execute
        </span>
      </Button>
    </header>
  );
}
