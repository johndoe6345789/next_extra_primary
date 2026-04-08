'use client';

import React from 'react';
import { classNames } from '../utils/classNames';
import styles from '../../../scss/TreeView.module.scss';
import {
  TreeViewContext,
  TreeViewProps,
} from './treeViewContext';
import { useTreeView } from './useTreeView';

export type { TreeViewProps };

/**
 * TreeView - Hierarchical list of tree nodes
 * with expand/collapse and selection.
 */
export function TreeView({
  children,
  defaultCollapseIcon,
  defaultEndIcon,
  defaultExpandIcon,
  defaultParentIcon,
  expanded: ctrlExpanded,
  defaultExpanded = [],
  selected: ctrlSelected,
  defaultSelected = [],
  multiSelect = false,
  dense = false,
  onNodeToggle,
  onNodeSelect,
  disableSelection = false,
  className,
  testId,
  ...props
}: TreeViewProps) {
  const tree = useTreeView(
    ctrlExpanded,
    defaultExpanded,
    ctrlSelected,
    defaultSelected,
    multiSelect,
    disableSelection,
    onNodeToggle,
    onNodeSelect
  );

  return (
    <TreeViewContext.Provider
      value={{
        expanded: tree.expanded,
        selected: tree.selected,
        multiSelect,
        dense,
        onNodeToggle: tree.handleToggle,
        onNodeSelect: tree.handleSelect,
        defaultCollapseIcon,
        defaultEndIcon,
        defaultExpandIcon,
        defaultParentIcon,
      }}
    >
      <ul
        className={classNames(
          styles.treeView,
          className
        )}
        role="tree"
        aria-multiselectable={multiSelect}
        data-testid={testId}
        {...props}
      >
        {children}
      </ul>
    </TreeViewContext.Provider>
  );
}

export default TreeView;
