'use client'

import React, { forwardRef } from 'react'
import styles from '../../../scss/atoms/mat-menu.module.scss'

const s = (key: string): string => styles[key] || key

/** Props for the MenuItem component */
export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Item label or content */
  children?: React.ReactNode
  /** Whether this item is highlighted/selected */
  selected?: boolean
  /** Value for Select integration */
  value?: string | number
  /** Leading icon element */
  icon?: React.ReactNode
  /** Test ID for automated testing */
  testId?: string
}

/**
 * MenuItem - a clickable list item inside a Menu.
 * Renders a button with the WAI-ARIA menuitem role.
 */
export const MenuItem = forwardRef<
  HTMLButtonElement,
  MenuItemProps
>(({
  children,
  selected,
  disabled,
  value,
  icon,
  testId,
  className = '',
  ...props
}, ref) => {
  const classes = [
    s('mat-mdc-menu-item'),
    selected ? s('mat-mdc-menu-item-highlighted') : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      ref={ref}
      className={classes}
      role="menuitem"
      disabled={disabled}
      aria-disabled={disabled}
      data-testid={testId}
      data-value={value}
      {...props}
    >
      {icon && (
        <span className={s('mat-icon')} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={s('mat-mdc-menu-item-text')}>
        {children}
      </span>
    </button>
  )
})

MenuItem.displayName = 'MenuItem'

export default MenuItem
