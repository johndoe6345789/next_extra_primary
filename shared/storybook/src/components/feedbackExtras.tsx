/**
 * Additional feedback components for registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

/** Circular spinner. */
export const CircularProgress: React.FC<
  ComponentProps & {
    size?: 'small' | 'medium' | 'large' | number
  }
> = ({ size = 'medium', className = '' }) => {
  const sm = { small: 16, medium: 24, large: 40 }
  const s = typeof size === 'number'
    ? size : sm[size]
  return (
    <div
      className={
        'inline-block animate-spin rounded-full'
        + ' border-2 border-current'
        + ` border-t-transparent ${className}`
      }
      style={{ width: s, height: s }}
      role="progressbar"
    />
  )
}

/** Skeleton loading placeholder. */
export const Skeleton: React.FC<
  ComponentProps & {
    variant?: string
    width?: string | number
    height?: string | number
    animation?: 'pulse' | 'wave' | false
  }
> = ({
  variant = 'text', width, height,
  animation = 'pulse', className = '',
}) => {
  const vc: Record<string, string> = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-md',
  }
  const ac = animation === 'pulse'
    ? 'animate-pulse' : ''
  return (
    <div
      className={
        `bg-muted ${vc[variant] || ''}`
        + ` ${ac} ${className}`
      }
      style={{
        width: width || (variant === 'circular'
          ? 40 : '100%'),
        height: height || (variant === 'text'
          ? 16
          : variant === 'circular' ? 40 : 100),
      }}
    />
  )
}
