'use client'

import React from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/TreeView.module.scss'
import { TreeNode } from './TreeViewTypes'
import {
  DefaultExpandIcon, DefaultCollapseIcon,
} from './TreeIcons'

/** Props for TreeItemContent */
interface TreeItemContentProps {
  node: TreeNode
  level: number
  isExpanded: boolean
  isSelected: boolean
  hasChildren: boolean
  dense?: boolean
  expandIcon?: React.ReactNode
  collapseIcon?: React.ReactNode
  endIcon?: React.ReactNode
  onToggle: (e: React.MouseEvent) => void
  onSelect: () => void
}

/** Content row of a tree item (icon + label) */
export function TreeItemContent({
  node, level, isExpanded, isSelected,
  hasChildren, dense, expandIcon, collapseIcon,
  endIcon, onToggle, onSelect,
}: TreeItemContentProps) {
  const icon = !hasChildren
    ? (endIcon
      ? <span className={styles.treeItemIcon}>{endIcon}</span>
      : <span className={styles.treeItemIconPlaceholder} />)
    : (
      <span className={styles.treeItemIcon} onClick={onToggle}>
        {isExpanded
          ? (collapseIcon || <DefaultCollapseIcon />)
          : (expandIcon || <DefaultExpandIcon />)}
      </span>
    )

  return (
    <div
      className={classNames(styles.treeItemContent, {
        [styles.selected as string]: isSelected,
        [styles.disabled as string]: node.disabled,
        [styles.dense as string]: dense,
      })}
      style={{ paddingLeft: `${level * 20 + 8}px` }}
      onClick={onSelect}
      role="treeitem"
      aria-selected={isSelected}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-disabled={node.disabled}
      tabIndex={node.disabled ? -1 : 0}
    >
      {icon}
      {node.icon && (
        <span className={styles.treeItemNodeIcon}>
          {node.icon}
        </span>
      )}
      <span className={styles.treeItemLabel}>
        {node.label}
      </span>
    </div>
  )
}
