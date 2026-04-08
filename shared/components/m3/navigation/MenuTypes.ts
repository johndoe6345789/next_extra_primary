/**
 * Type definitions for Menu components.
 */
import type React from 'react'

/** Props for the Menu popup panel */
export interface MenuProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  open?: boolean
  anchorEl?: HTMLElement | null
  onClose?: () => void
  /** Menu appears from right side */
  anchorRight?: boolean
  /** Menu appears from bottom */
  anchorBottom?: boolean
  /** Dense variant with smaller items */
  dense?: boolean
  /** Multi-column layout (max-height wrapping) */
  multiColumn?: boolean
  /** Max height per column (default 80vh) */
  columnHeight?: number
  /** Test identifier */
  testId?: string
}

/** Props for an individual menu item */
export interface MenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  /** Value for Select component integration */
  value?: string | number
  /** Leading icon element */
  icon?: React.ReactNode
  /** Keyboard shortcut text */
  shortcut?: string
  /** Trailing element */
  trailing?: React.ReactNode
  /** Test identifier */
  testId?: string
}

/** Props for a menu list wrapper */
export interface MenuListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/** Props for a menu divider */
export interface MenuDividerProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/** Props for a menu subheader */
export interface MenuSubheaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}
