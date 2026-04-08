/**
 * Media components for registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

export { Table, Pagination }
  from './tableComponent'

/** Image component. */
export const Image: React.FC<
  ComponentProps & {
    src?: string; alt?: string
    width?: string | number
    height?: string | number
    objectFit?: string
  }
> = ({
  src, alt = 'Image', width, height,
  objectFit = 'cover', className = '',
}) => (
  src ? (
    <img
      src={src} alt={alt} className={className}
      style={{
        width, height,
        objectFit: objectFit as
          React.CSSProperties['objectFit'],
      }}
    />
  ) : (
    <div
      className={
        'bg-muted flex items-center'
        + ' justify-center text-muted-foreground'
        + ` ${className}`
      }
      style={{
        width: width || 200,
        height: height || 150,
      }}
    >
      [Image: {alt}]
    </div>
  )
)

/** Embedded iframe. */
export const Iframe: React.FC<
  ComponentProps & {
    src?: string; title?: string
    width?: string | number
    height?: string | number
  }
> = ({
  src, title = 'Embedded content',
  width = '100%', height = 400, className = '',
}) => (
  src ? (
    <iframe
      src={src} title={title}
      className={`border rounded ${className}`}
      style={{ width, height }}
    />
  ) : (
    <div
      className={
        'bg-muted border rounded flex'
        + ' items-center justify-center'
        + ` text-muted-foreground ${className}`
      }
      style={{ width, height }}
    >
      [Iframe: {title}]
    </div>
  )
)
