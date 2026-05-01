'use client';
import React, { forwardRef } from 'react'
import { sxToStyle } from '../utils/sx'

/**
 * Box — the m3 layout primitive. The `sx` prop is
 * converted to a STATIC inline style object: it does
 * NOT support MUI's responsive shorthand
 * `{ xs, sm, md, lg, xl }`. In development, passing
 * such an object logs a `[m3/sx]` warning. For
 * breakpoint-aware values, resolve a concrete value
 * with the `useMediaQuery` hook in
 * `shared/components/m3/utils/useMediaQuery.ts` and
 * pass that single value through `sx`.
 */

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
