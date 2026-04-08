/**
 * Display components for JSON component registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

interface IconProps extends ComponentProps {
  name?: string
  size?: 'small' | 'medium' | 'large'
}

const ICON_MAP: Record<string, string> = {
  users: '\uD83D\uDC65', settings: '\u2699\uFE0F',
  dashboard: '\uD83D\uDCCA', home: '\uD83C\uDFE0',
  edit: '\u270F\uFE0F', delete: '\uD83D\uDDD1\uFE0F',
  add: '\u2795', check: '\u2713', close: '\u2715',
  arrow_up: '\u2191', arrow_down: '\u2193',
  trending_up: '\uD83D\uDCC8',
  trending_down: '\uD83D\uDCC9',
}

/** Icon component with emoji fallback. */
export const Icon: React.FC<IconProps> = ({
  name = 'default', size = 'medium', className = '',
}) => {
  const sizes = {
    small: 'text-sm', medium: 'text-xl',
    large: 'text-3xl',
  }
  return (
    <span className={`${sizes[size]} ${className}`}>
      {ICON_MAP[name] || `[${name}]`}
    </span>
  )
}

/** Horizontal divider line. */
export const Divider: React.FC<ComponentProps> = ({
  className = 'border-t my-4',
}) => <hr className={className} />

/** Avatar circle. */
export const Avatar: React.FC<
  ComponentProps & { src?: string; alt?: string }
> = ({
  src, alt = 'Avatar',
  className = 'w-10 h-10 rounded-full bg-muted flex items-center justify-center',
}) => (
  src
    ? <img src={src} alt={alt} className={className} />
    : <div className={className}>{alt[0]}</div>
)

/** Small badge label. */
export const Badge: React.FC<
  ComponentProps & { color?: string }
> = ({
  color: _color = 'default', className = '',
  children,
}) => (
  <span className={
    `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted ${className}`
  }>
    {children}
  </span>
)

/** Chip / tag element. */
export const Chip: React.FC<
  ComponentProps & { label?: string }
> = ({
  label,
  className = 'inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted',
  children,
}) => (
  <span className={className}>
    {label || children}
  </span>
)
