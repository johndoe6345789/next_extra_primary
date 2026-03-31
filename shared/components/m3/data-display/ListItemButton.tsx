'use client'

import React, { forwardRef } from 'react'
import { sxToStyle } from '../utils/sx'
import styles from '../../../scss/atoms/mat-list.module.scss'

const s = (key: string): string => styles[key] || key

/** Props for the ListItemButton component */
export interface ListItemButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Content rendered inside the button */
  children?: React.ReactNode
  /** Whether this item is selected */
  selected?: boolean
  /** Whether this item is disabled */
  disabled?: boolean
  /** Render as a custom element */
  component?: React.ElementType
  /** Inline style overrides via sx map */
  sx?: Record<string, unknown>
}

/**
 * ListItemButton - a clickable list item.
 * Renders as an anchor when href is provided,
 * otherwise renders as a button.
 */
export const ListItemButton = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  ListItemButtonProps
>(({
  children,
  selected,
  disabled,
  component,
  href,
  className = '',
  sx,
  style,
  ...props
}, ref) => {
  const Component = component || (href ? 'a' : 'button')
  const elementProps = href ? { href, ...props } : props

  const classes = [
    s('mdc-list-item'),
    s('mat-mdc-list-item'),
    s('mat-mdc-list-item-interactive'),
    selected ? s('mdc-list-item--selected') : '',
    disabled ? s('mdc-list-item--disabled') : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <Component
      ref={ref}
      className={classes}
      style={{ ...sxToStyle(sx), ...style }}
      data-testid="list-item-button"
      aria-selected={selected}
      aria-disabled={disabled}
      {...elementProps}
    >
      <span className={s('mat-focus-indicator')} />
      {children}
    </Component>
  )
})

ListItemButton.displayName = 'ListItemButton'

export default ListItemButton
