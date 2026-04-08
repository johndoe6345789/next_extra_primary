/**
 * Layout components for JSON component registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

/** Generic box container. */
export const Box: React.FC<ComponentProps> = ({
  className, children, ...props
}) => (
  <div className={className} {...props}>{children}</div>
)

/** Vertical stack layout. */
export const Stack: React.FC<ComponentProps> = ({
  className = 'flex flex-col gap-4', children,
}) => (
  <div className={className}>{children}</div>
)

/** Horizontal flex layout. */
export const Flex: React.FC<ComponentProps> = ({
  className = 'flex gap-4', children,
}) => (
  <div className={className}>{children}</div>
)

/** Grid layout. */
export const Grid: React.FC<ComponentProps> = ({
  className = 'grid grid-cols-2 gap-4', children,
}) => (
  <div className={className}>{children}</div>
)

/** Centered container. */
export const Container: React.FC<ComponentProps> = ({
  className = 'max-w-7xl mx-auto px-4', children,
}) => (
  <div className={className}>{children}</div>
)

/** Scrollable area. */
export const ScrollArea: React.FC<
  ComponentProps & { maxHeight?: string | number }
> = ({
  className = 'overflow-auto', maxHeight, children,
}) => (
  <div
    className={className}
    style={{ maxHeight: maxHeight || 'auto' }}
  >
    {children}
  </div>
)

/** Component reference placeholder. */
export const ComponentRef: React.FC<
  ComponentProps & {
    refId?: string; component?: string
  }
> = ({
  refId, component,
  className = 'p-2 border border-dashed rounded bg-muted/30',
  children,
}) => (
  <div className={className}>
    {children || (
      <span className="text-xs text-muted-foreground">
        Component: {component || refId || 'unknown'}
      </span>
    )}
  </div>
)
