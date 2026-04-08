/**
 * Typography component for JSON component registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

interface TypographyProps extends ComponentProps {
  variant?: string
  text?: string
}

const VARIANT_CLASSES: Record<string, string> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
  body1: 'text-base',
  body2: 'text-sm',
  caption: 'text-xs text-muted-foreground',
  overline:
    'text-xs uppercase tracking-wide text-muted-foreground',
}

/** Typography component with variant support. */
export const Typography: React.FC<
  TypographyProps
> = ({
  variant = 'body1',
  text,
  className = '',
  children,
}) => {
  const content = text ?? children
  const cls =
    `${VARIANT_CLASSES[variant] || ''} ${className}`

  switch (variant) {
    case 'h1': return <h1 className={cls}>{content}</h1>
    case 'h2': return <h2 className={cls}>{content}</h2>
    case 'h3': return <h3 className={cls}>{content}</h3>
    case 'h4': return <h4 className={cls}>{content}</h4>
    case 'h5': return <h5 className={cls}>{content}</h5>
    case 'h6': return <h6 className={cls}>{content}</h6>
    default: return <p className={cls}>{content}</p>
  }
}
