/**
 * WorkspacePreview - Live preview card
 * for workspace creation form
 */

import React from 'react';
import { WORKSPACE_COLORS }
  from './workspaceFormTypes';
import styles from '../../scss/components/forms/create-workspace-form.module.scss';

/** Props for the WorkspacePreview. */
interface WorkspacePreviewProps {
  /** Display initials */
  initials: string;
  /** Workspace name */
  name: string;
  /** Workspace description */
  description: string;
  /** Selected color */
  color: string;
  /** Color change handler */
  onColorChange: (color: string) => void;
}

/**
 * Preview card with color picker.
 *
 * @param props - Component props.
 */
export const WorkspacePreview: React.FC<
  WorkspacePreviewProps
> = ({
  initials,
  name,
  description,
  color,
  onColorChange,
}) => (
  <div className={styles.preview}>
    <div className={styles.previewCard}>
      <div
        className={styles.previewMedia}
        style={{ backgroundColor: color }}
      >
        <span className={styles.previewInitials}>
          {initials}
        </span>
      </div>
      <div className={styles.previewContent}>
        <p className={styles.previewTitle}>
          {name || 'Workspace Name'}
        </p>
        <p className={styles.previewDesc}>
          {description || 'No description'}
        </p>
      </div>
    </div>
    <div className={styles.colorPicker}>
      {WORKSPACE_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          className={
            `${styles.colorSwatch} ${c === color ? styles.active : ''}`
          }
          style={{ backgroundColor: c }}
          onClick={() => onColorChange(c)}
          aria-label={`Select color ${c}`}
        />
      ))}
    </div>
  </div>
);
