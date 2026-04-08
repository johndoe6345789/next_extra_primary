/**
 * Surface components for JSON component registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

/** Card surface. */
export const Card: React.FC<ComponentProps> = ({
  className = 'rounded-lg border shadow-sm bg-canvas',
  children,
}) => (
  <div className={className}>{children}</div>
)

/** Card header section. */
export const CardHeader: React.FC<ComponentProps> = ({
  className = 'p-6 pb-2', children,
}) => (
  <div className={className}>{children}</div>
)

/** Card content section. */
export const CardContent: React.FC<ComponentProps> = ({
  className = 'p-6 pt-0', children,
}) => (
  <div className={className}>{children}</div>
)

/** Card actions section. */
export const CardActions: React.FC<ComponentProps> = ({
  className = 'p-6 pt-0 flex gap-2', children,
}) => (
  <div className={className}>{children}</div>
)

/** Card description text. */
export const CardDescription: React.FC<
  ComponentProps
> = ({
  className = 'text-sm text-muted-foreground',
  children,
}) => (
  <p className={className}>{children}</p>
)

/** Paper surface. */
export const Paper: React.FC<ComponentProps> = ({
  className = 'rounded border p-4 bg-canvas',
  children,
}) => (
  <div className={className}>{children}</div>
)
