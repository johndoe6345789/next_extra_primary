/**
 * List/menu components for JSON registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

export {
  ListItemButton, Collapse,
  Accordion, AccordionSummary, AccordionDetails,
} from './listExtras'
export {
  ListItemIcon, ListItemText,
} from './listItemParts'

/** Menu dropdown container. */
export const Menu: React.FC<ComponentProps> = ({
  children, className = '',
}) => (
  <div className={
    'absolute right-0 top-full mt-1 bg-canvas'
    + ' border rounded-md shadow-lg'
    + ` min-w-[160px] py-1 z-50 ${className}`
  }>
    {children}
  </div>
)

/** Menu item. */
export const MenuItem: React.FC<
  ComponentProps & {
    onClick?: () => void
    disabled?: boolean; selected?: boolean
  }
> = ({
  children, onClick, disabled = false,
  selected = false, className = '',
}) => (
  <div
    className={
      'flex items-center gap-2 px-4 py-2'
      + ' text-sm cursor-pointer hover:bg-muted'
      + (disabled
        ? ' opacity-50 cursor-not-allowed' : '')
      + (selected ? ' bg-accent/10' : '')
      + ` ${className}`
    }
    onClick={disabled ? undefined : onClick}
  >
    {children}
  </div>
)

/** Unordered list container. */
export const List: React.FC<ComponentProps> = ({
  children, className = 'flex flex-col',
}) => <ul className={className}>{children}</ul>

/** List item. */
export const ListItem: React.FC<
  ComponentProps & {
    button?: boolean; selected?: boolean
  }
> = ({
  button = false, selected = false,
  children, className = '',
}) => (
  <li className={
    'flex items-center gap-2 px-4 py-2'
    + (button
      ? ' cursor-pointer hover:bg-muted' : '')
    + (selected ? ' bg-accent/10' : '')
    + ` ${className}`
  }>
    {children}
  </li>
)
