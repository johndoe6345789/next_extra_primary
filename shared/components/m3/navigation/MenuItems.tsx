/**
 * Menu sub-components: MenuItem, MenuList,
 * MenuDivider, and MenuSubheader.
 */

import React, { forwardRef } from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/mat-menu.module.scss'
import type {
  MenuItemProps,
  MenuListProps,
  MenuDividerProps,
  MenuSubheaderProps,
} from './MenuTypes'

const s = (key: string): string => styles[key] || key

/** A single selectable menu item with optional icon. */
export const MenuItem = forwardRef<
  HTMLButtonElement, MenuItemProps
>(({
  children, selected, disabled, value, icon,
  shortcut, trailing, testId, className, ...props
}, ref) => (
  <button
    ref={ref}
    className={classNames(
      s('mat-mdc-menu-item'),
      { [s('mat-mdc-menu-item-highlighted')]: selected },
      className,
    )}
    role="menuitem"
    disabled={disabled}
    aria-disabled={disabled}
    data-testid={testId}
    data-value={value}
    {...props}
  >
    {icon && (
      <span className={classNames(s('mat-icon'), styles.menuItemIcon)}>
        {icon}
      </span>
    )}
    <span className={classNames(s('mat-mdc-menu-item-text'), styles.menuItemText)}>
      {children}
    </span>
    {shortcut && <span className={styles.menuItemShortcut}>{shortcut}</span>}
    {trailing && <span className={styles.menuItemTrailing}>{trailing}</span>}
  </button>
))

MenuItem.displayName = 'MenuItem'

/** Wrapper for a list of menu items. */
export const MenuList: React.FC<MenuListProps> = ({
  children, className, ...props
}) => (
  <div
    className={classNames(s('mat-mdc-menu-content'), className)}
    role="menu"
    {...props}
  >
    {children}
  </div>
)

/** Horizontal separator between menu items. */
export const MenuDivider: React.FC<MenuDividerProps> = ({
  className, ...props
}) => (
  <div
    className={classNames(s('mat-divider'), styles.menuDivider, className)}
    role="separator"
    {...props}
  />
)

/** Section subheader label inside a menu. */
export const MenuSubheader: React.FC<MenuSubheaderProps> = ({
  children, className, ...props
}) => (
  <div
    className={classNames(styles.menuSubheader, className)}
    {...props}
  >
    {children}
  </div>
)
