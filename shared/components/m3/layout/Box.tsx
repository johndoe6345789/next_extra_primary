'use client';
import React, { forwardRef } from 'react'
import { sxToStyle } from '../utils/sx'

export type BoxProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode
  component?: React.ElementType
  sx?: Record<string, unknown>
  testId?: string
} & Record<string, unknown>

export const Box = forwardRef<HTMLElement, BoxProps>(
  (allProps, ref) => {
    const {
      children,
      component = 'div',
      className = '',
      sx,
      style,
      testId,
      ...rest
    } = allProps
    const Tag = (component ?? 'div') as React.ElementType
    const sxStyle = sxToStyle(
      sx as Record<string, unknown> | undefined,
    )
    return (
      <Tag
        ref={ref}
        className={className as string}
        style={{
          ...sxStyle,
          ...(style as React.CSSProperties),
        }}
        data-testid={testId as string}
        {...rest}
      >
        {children}
      </Tag>
    )
  },
)

Box.displayName = 'Box'

export default Box
