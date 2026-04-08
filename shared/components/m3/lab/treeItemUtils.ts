import type React from 'react'

/**
 * Compute display icon for a tree item.
 * @param p - Tree item config.
 * @returns Icon node to display.
 */
export function getDisplayIcon(p: {
  hasChildren: boolean;
  isExpanded: boolean;
  collapseIcon?: React.ReactNode;
  expandIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  defaultCollapseIcon?: React.ReactNode;
  defaultExpandIcon?: React.ReactNode;
  defaultEndIcon?: React.ReactNode;
}): React.ReactNode {
  if (p.hasChildren) {
    return p.isExpanded
      ? (p.collapseIcon
        || p.defaultCollapseIcon
        || '\u25BC')
      : (p.expandIcon
        || p.defaultExpandIcon
        || '\u25B6');
  }
  return p.endIcon
    || p.defaultEndIcon || null;
}
