import React from 'react';
import styles from '../../../scss/TreeView.module.scss';

interface TreeItemIconsProps {
  hasChildren: boolean;
  isExpanded: boolean;
  displayIcon: React.ReactNode;
  icon?: React.ReactNode;
  onExpand: (e: React.MouseEvent) => void;
}

/**
 * TreeItemIcons - Renders the expand/collapse
 * icon and optional node icon for a TreeItem.
 */
export function TreeItemIcons({
  hasChildren,
  isExpanded,
  displayIcon,
  icon,
  onExpand,
}: TreeItemIconsProps) {
  return (
    <>
      {hasChildren && (
        <span
          className={styles.treeItemIcon}
          onClick={onExpand}
        >
          {displayIcon}
        </span>
      )}
      {!hasChildren && displayIcon && (
        <span className={styles.treeItemIcon}>
          {displayIcon}
        </span>
      )}
      {!hasChildren && !displayIcon && (
        <span
          className={
            styles.treeItemIconPlaceholder
          }
        />
      )}
      {icon && (
        <span
          className={styles.treeItemNodeIcon}
        >
          {icon}
        </span>
      )}
    </>
  );
}

export default TreeItemIcons;
