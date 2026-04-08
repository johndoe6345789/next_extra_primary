import React, { useContext } from 'react';
import { TreeViewContext }
  from './treeViewContext';
import { getDisplayIcon }
  from './treeItemUtils';

/** Return value of useTreeItemState. */
export interface TreeItemState {
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  displayIcon: React.ReactNode;
  handleClick: (e: React.MouseEvent) => void;
  handleExpand: (e: React.MouseEvent) => void;
  ctx: {
    dense: boolean;
  };
}

/**
 * Extracts TreeItem interaction state.
 * @param nodeId - The node identifier.
 * @param disabled - Whether disabled.
 * @param childCount - Number of children.
 * @param icons - Icon overrides.
 * @returns Computed state for the tree item.
 */
export function useTreeItemState(
  nodeId: string,
  disabled: boolean,
  childCount: number,
  icons: {
    collapseIcon?: React.ReactNode;
    expandIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
  },
): TreeItemState {
  const ctx = useContext(TreeViewContext);
  const isExpanded =
    ctx.expanded.includes(nodeId);
  const isSelected =
    ctx.selected.includes(nodeId);
  const hasChildren = childCount > 0;
  const handleClick = (
    e: React.MouseEvent
  ) => {
    if (!disabled) ctx.onNodeSelect(e, nodeId);
  };
  const handleExpand = (
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (!disabled) ctx.onNodeToggle(e, nodeId);
  };
  const displayIcon = getDisplayIcon({
    hasChildren, isExpanded,
    collapseIcon: icons.collapseIcon,
    expandIcon: icons.expandIcon,
    endIcon: icons.endIcon,
    defaultCollapseIcon:
      ctx.defaultCollapseIcon,
    defaultExpandIcon:
      ctx.defaultExpandIcon,
    defaultEndIcon: ctx.defaultEndIcon,
  });
  return {
    isExpanded, isSelected, hasChildren,
    displayIcon, handleClick, handleExpand,
    ctx: { dense: ctx.dense },
  };
}
