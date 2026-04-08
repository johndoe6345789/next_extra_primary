/**
 * Button component for JSON component registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

interface ButtonProps extends ComponentProps {
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'error'
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

const SIZE_CLS = {
  small: 'px-2 py-1 text-sm',
  medium: 'px-4 py-2',
  large: 'px-6 py-3 text-lg',
}

const VAR_CLS = {
  contained:
    'bg-accent text-accent-foreground hover:opacity-90',
  outlined:
    'border border-accent text-accent hover:bg-accent/10',
  text: 'text-accent hover:bg-accent/10',
}

/** Styled button component. */
export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color: _color = 'primary',
  size = 'medium',
  className = '',
  children,
  onClick,
}) => {
  const base =
    'rounded font-medium transition-colors cursor-pointer'
  return (
    <button
      className={
        `${base} ${SIZE_CLS[size]} ${VAR_CLS[variant]} ${className}`
      }
      onClick={onClick}
      style={{
        backgroundColor:
          variant === 'contained'
            ? 'var(--color-accent)' : undefined,
      }}
    >
      {children}
    </button>
  )
}
