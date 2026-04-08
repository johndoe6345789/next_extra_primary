/**
 * List extra components: collapse & accordion.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

/** Clickable list item. */
export const ListItemButton: React.FC<
  ComponentProps & {
    selected?: boolean; onClick?: () => void
  }
> = ({
  selected = false, onClick,
  children, className = '',
}) => (
  <li
    className={
      'flex items-center gap-2 px-4 py-2'
      + ' cursor-pointer hover:bg-muted'
      + ` ${selected ? 'bg-accent/10' : ''}`
      + ` ${className}`
    }
    onClick={onClick}
  >
    {children}
  </li>
)

/** Collapsible container. */
export const Collapse: React.FC<
  ComponentProps & {
    in?: boolean; open?: boolean
  }
> = ({
  in: isIn = true, open = true,
  children, className = '',
}) => {
  const show = isIn || open
  return show
    ? <div className={className}>{children}</div>
    : null
}

/** Accordion container. */
export const Accordion: React.FC<
  ComponentProps
> = ({
  className = 'border rounded mb-2', children,
}) => <div className={className}>{children}</div>

/** Accordion summary (clickable header). */
export const AccordionSummary: React.FC<
  ComponentProps
> = ({
  className = 'px-4 py-3 font-medium'
    + ' cursor-pointer hover:bg-muted/50',
  children,
}) => <div className={className}>{children}</div>

/** Accordion details (collapsible body). */
export const AccordionDetails: React.FC<
  ComponentProps
> = ({
  className = 'px-4 pb-3 text-sm', children,
}) => <div className={className}>{children}</div>
