'use client'

import React, { useCallback } from 'react'
import styles from '../../../scss/TreeView.module.scss'
import { TreeItemProps } from './TreeViewTypes'
import { TreeItemContent } from './TreeItemContent'

/**
 * TreeItem - recursive tree node renderer
 */
export function TreeItem({
  node,
  level,
  expanded,
  selected,
  multiSelect,
  onToggleExpand,
  onSelect,
  expandIcon,
  collapseIcon,
  endIcon,
  dense,
}: TreeItemProps) {
  const hasChildren =
    node.children && node.children.length > 0
  const isExpanded = expanded.has(node.id)
  const isSelected = selected.has(node.id)

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (hasChildren) onToggleExpand(node.id)
    },
    [hasChildren, node.id, onToggleExpand]
  )

  const handleSelect = useCallback(() => {
    if (!node.disabled) onSelect(node.id, node)
  }, [node, onSelect])

  return (
    <li className={styles.treeItem}>
      <TreeItemContent
        node={node}
        level={level}
        isExpanded={isExpanded}
        isSelected={isSelected}
        hasChildren={!!hasChildren}
        dense={dense}
        expandIcon={expandIcon}
        collapseIcon={collapseIcon}
        endIcon={endIcon}
        onToggle={handleToggle}
        onSelect={handleSelect}
      />
      {hasChildren && isExpanded && (
        <ul
          className={styles.treeItemChildren}
          role="group"
        >
          {node.children!.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              selected={selected}
              multiSelect={multiSelect}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              expandIcon={expandIcon}
              collapseIcon={collapseIcon}
              endIcon={endIcon}
              dense={dense}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
