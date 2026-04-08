/**
 * Extra navigation components for registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

/** App bar header. */
export const AppBar: React.FC<ComponentProps> = ({
  children, className = 'bg-canvas border-b',
}) => (
  <header className={className}>
    {children}
  </header>
)

/** Toolbar row. */
export const Toolbar: React.FC<ComponentProps> = ({
  children,
  className = 'flex items-center gap-4 px-4 py-2',
}) => <div className={className}>{children}</div>

/** Hyperlink. */
export const Link: React.FC<
  ComponentProps & { href?: string }
> = ({
  href = '#', children,
  className = 'text-accent hover:underline',
}) => (
  <a href={href} className={className}>
    {children}
  </a>
)

/** Breadcrumb trail. */
export const Breadcrumbs: React.FC<
  ComponentProps & {
    separator?: React.ReactNode
  }
> = ({
  separator = '/',
  children,
  className = 'flex items-center gap-2 text-sm',
}) => {
  const items = React.Children.toArray(children)
  return (
    <nav className={className}>
      {items.map((child, i) => (
        <React.Fragment key={i}>
          {child}
          {i < items.length - 1 && (
            <span className="text-muted-foreground">
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
