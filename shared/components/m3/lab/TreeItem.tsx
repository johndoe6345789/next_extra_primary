'use client';

import React, { forwardRef } from 'react';
import { classNames }
  from '../utils/classNames';
import styles
  from '../../../scss/TreeView.module.scss';
import type { TreeItemProps }
  from './treeViewContext';
import { TreeItemIcons }
  from './TreeItemIcons';
import { useTreeItemState }
  from './useTreeItemState';

export type { TreeItemProps };

/** A single node in a TreeView. */
export const TreeItem = forwardRef<
  HTMLLIElement, TreeItemProps
>(function TreeItem(
  {
    nodeId, label, children, icon,
    expandIcon, collapseIcon, endIcon,
    disabled = false, className,
    ContentProps = {}, ...props
  }, ref,
) {
  const childCount =
    React.Children.count(children);
  const s = useTreeItemState(
    nodeId, disabled, childCount,
    { collapseIcon, expandIcon, endIcon },
  );
  return (
    <li ref={ref}
      className={classNames(
        styles.treeItem, className)}
      role="treeitem"
      aria-expanded={s.hasChildren
        ? s.isExpanded : undefined}
      aria-selected={s.isSelected}
      aria-disabled={disabled} {...props}>
      <div className={classNames(
        styles.treeItemContent, {
          [styles.selected]: s.isSelected,
          [styles.disabled]: disabled,
          [styles.dense]: s.ctx.dense,
        })} onClick={s.handleClick}
        {...ContentProps}>
        <TreeItemIcons
          hasChildren={s.hasChildren}
          isExpanded={s.isExpanded}
          displayIcon={s.displayIcon}
          icon={icon}
          onExpand={s.handleExpand} />
        <span className={
          styles.treeItemLabel
        }>{label}</span>
      </div>
      {s.hasChildren && s.isExpanded && (
        <ul className={
          styles.treeItemChildren
        } role="group">{children}</ul>
      )}
    </li>
  );
});

export default TreeItem;
