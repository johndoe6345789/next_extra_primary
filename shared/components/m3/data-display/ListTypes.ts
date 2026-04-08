import React from 'react'

/**
 * Props for the List component
 */
export interface ListProps
  extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  dense?: boolean
  spaced?: boolean
  /** Render as different element (nav, div) */
  component?: React.ElementType
  /** Disable padding */
  disablePadding?: boolean
  /** MUI sx prop */
  sx?: Record<string, unknown>
  /** Test ID for automated testing */
  testId?: string
}

/**
 * Props for ListItem
 */
export interface ListItemProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode
  clickable?: boolean
  selected?: boolean
  disabled?: boolean
  borderless?: boolean
  /** Disable padding (MUI-style) */
  disablePadding?: boolean
  /** Disable gutters (MUI-style) */
  disableGutters?: boolean
  /** MUI sx prop */
  sx?: Record<string, unknown>
}

/**
 * Props for ListItemButton
 */
export interface ListItemButtonProps
  extends React.AnchorHTMLAttributes<
    HTMLAnchorElement
  > {
  children?: React.ReactNode
  selected?: boolean
  disabled?: boolean
  /** Render as different element */
  component?: React.ElementType
  /** MUI sx prop */
  sx?: Record<string, unknown>
}

/**
 * Props for ListItemIcon
 */
export interface ListItemIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
}

/**
 * Props for ListItemText
 */
export interface ListItemTextProps
  extends React.HTMLAttributes<HTMLDivElement> {
  primary?: React.ReactNode
  secondary?: React.ReactNode
}

/**
 * Props for ListItemAvatar
 */
export interface ListItemAvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/**
 * Props for ListSubheader
 */
export interface ListSubheaderProps
  extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode
}
