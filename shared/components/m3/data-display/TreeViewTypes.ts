import React from 'react'

/**
 * Tree data node definition
 */
export interface TreeNode {
  id: string
  label: string
  icon?: React.ReactNode
  children?: TreeNode[]
  disabled?: boolean
}

/**
 * Props for the TreeView component
 */
export interface TreeViewProps {
  /** Tree data nodes */
  data: TreeNode[]
  /** Initially expanded node IDs */
  defaultExpanded?: string[]
  /** Controlled expanded node IDs */
  expanded?: string[]
  /** Initially selected node IDs */
  defaultSelected?: string[]
  /** Controlled selected node IDs */
  selected?: string[]
  /** Enable multi-select */
  multiSelect?: boolean
  /** Callback when node is selected */
  onSelect?: (
    nodeId: string,
    node: TreeNode
  ) => void
  /** Callback when selection changes */
  onSelectionChange?: (nodeIds: string[]) => void
  /** Callback when node is toggled */
  onToggle?: (
    nodeId: string,
    isExpanded: boolean
  ) => void
  /** Custom expand icon */
  expandIcon?: React.ReactNode
  /** Custom collapse icon */
  collapseIcon?: React.ReactNode
  /** Custom end icon (leaf nodes) */
  endIcon?: React.ReactNode
  /** Additional CSS class */
  className?: string
  /** Dense layout */
  dense?: boolean
  /** Test ID for automated testing */
  testId?: string
}

/**
 * Internal props for the TreeItem sub-component
 */
export interface TreeItemProps {
  node: TreeNode
  level: number
  expanded: Set<string>
  selected: Set<string>
  multiSelect: boolean
  onToggleExpand: (nodeId: string) => void
  onSelect: (
    nodeId: string,
    node: TreeNode
  ) => void
  expandIcon?: React.ReactNode
  collapseIcon?: React.ReactNode
  endIcon?: React.ReactNode
  dense?: boolean
}
