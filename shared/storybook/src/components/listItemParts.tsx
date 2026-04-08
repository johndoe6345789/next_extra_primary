/**
 * List item sub-components for registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

/** List item icon container. */
export const ListItemIcon: React.FC<
  ComponentProps
> = ({
  children,
  className = 'flex-shrink-0 w-6 h-6'
    + ' flex items-center justify-center',
}) => (
  <span className={className}>{children}</span>
)

/** List item text. */
export const ListItemText: React.FC<
  ComponentProps & {
    primary?: string; secondary?: string
  }
> = ({
  primary, secondary, children,
  className = 'flex flex-col',
}) => (
  <div className={className}>
    {primary && (
      <span className="text-sm font-medium">
        {primary}
      </span>
    )}
    {secondary && (
      <span className={
        'text-xs text-muted-foreground'
      }>
        {secondary}
      </span>
    )}
    {children}
  </div>
)
