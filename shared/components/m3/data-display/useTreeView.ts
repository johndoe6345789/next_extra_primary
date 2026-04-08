'use client'

import { useState, useCallback, useMemo } from 'react'
import { TreeNode } from './TreeViewTypes'

/** Args for the useTreeView hook */
interface UseTreeViewArgs {
  defaultExpanded?: string[]
  expanded?: string[]
  defaultSelected?: string[]
  selected?: string[]
  multiSelect?: boolean
  onSelect?: (nodeId: string, node: TreeNode) => void
  onSelectionChange?: (ids: string[]) => void
  onToggle?: (nodeId: string, open: boolean) => void
}

/** Hook encapsulating TreeView expand/select state */
export function useTreeView(args: UseTreeViewArgs) {
  const [intExp, setIntExp] = useState<Set<string>>(
    new Set(args.defaultExpanded ?? [])
  )
  const [intSel, setIntSel] = useState<Set<string>>(
    new Set(args.defaultSelected ?? [])
  )

  const expanded = useMemo(
    () => args.expanded !== undefined
      ? new Set(args.expanded) : intExp,
    [args.expanded, intExp]
  )

  const selected = useMemo(
    () => args.selected !== undefined
      ? new Set(args.selected) : intSel,
    [args.selected, intSel]
  )

  const handleToggle = useCallback(
    (nodeId: string) => {
      const next = new Set(expanded)
      const opening = !next.has(nodeId)
      opening ? next.add(nodeId) : next.delete(nodeId)
      if (args.expanded === undefined) setIntExp(next)
      args.onToggle?.(nodeId, opening)
    },
    [expanded, args.expanded, args.onToggle]
  )

  const handleSelect = useCallback(
    (nodeId: string, node: TreeNode) => {
      let next: Set<string>
      if (args.multiSelect) {
        next = new Set(selected)
        next.has(nodeId)
          ? next.delete(nodeId) : next.add(nodeId)
      } else {
        next = new Set([nodeId])
      }
      if (args.selected === undefined) setIntSel(next)
      args.onSelect?.(nodeId, node)
      args.onSelectionChange?.(Array.from(next))
    },
    [
      selected, args.multiSelect,
      args.selected, args.onSelect,
      args.onSelectionChange,
    ]
  )

  return { expanded, selected, handleToggle, handleSelect }
}
