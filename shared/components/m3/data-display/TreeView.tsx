'use client'

import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/TreeView.module.scss'
import { TreeViewProps } from './TreeViewTypes'
import { TreeItem } from './TreeItem'
import { useTreeView } from './useTreeView'

export type { TreeNode, TreeViewProps }
  from './TreeViewTypes'

/**
 * TreeView - hierarchical tree navigation
 *
 * @example
 * ```tsx
 * <TreeView data={nodes} onSelect={handleSelect} />
 * ```
 */
export function TreeView({
  data, defaultExpanded, expanded: ctrlExp,
  defaultSelected, selected: ctrlSel,
  multiSelect = false, onSelect, onSelectionChange,
  onToggle, expandIcon, collapseIcon, endIcon,
  className, dense = false, testId,
}: TreeViewProps) {
  const {
    expanded, selected, handleToggle, handleSelect,
  } = useTreeView({
    defaultExpanded, expanded: ctrlExp,
    defaultSelected, selected: ctrlSel,
    multiSelect, onSelect, onSelectionChange, onToggle,
  })

  return (
    <ul
      className={classNames(styles.treeView, className)}
      role="tree"
      aria-multiselectable={multiSelect}
      data-testid={testId}
    >
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          expanded={expanded}
          selected={selected}
          multiSelect={multiSelect}
          onToggleExpand={handleToggle}
          onSelect={handleSelect}
          expandIcon={expandIcon}
          collapseIcon={collapseIcon}
          endIcon={endIcon}
          dense={dense}
        />
      ))}
    </ul>
  )
}

export default TreeView
