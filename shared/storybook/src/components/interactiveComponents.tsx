/**
 * Interactive components for JSON registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

export {
  FormField, ConditionalRender,
} from './formFieldComponent'

/** Icon button. */
export const IconButton: React.FC<
  ComponentProps & {
    onClick?: () => void; disabled?: boolean
    size?: 'small' | 'medium' | 'large'
  }
> = ({
  children, onClick, disabled = false,
  size = 'medium', className = '',
}) => {
  const sc = {
    small: 'p-1 text-sm',
    medium: 'p-2',
    large: 'p-3 text-lg',
  }
  return (
    <button
      className={
        'rounded-full hover:bg-muted/50'
        + ' transition-colors inline-flex'
        + ' items-center justify-center'
        + ` ${sc[size]}`
        + (disabled
          ? ' opacity-50 cursor-not-allowed'
          : ' cursor-pointer')
        + ` ${className}`
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

/** Toggle switch. */
export const Switch: React.FC<
  ComponentProps & {
    checked?: boolean; disabled?: boolean
    label?: string
  }
> = ({
  checked = false, disabled = false,
  label, className = '',
}) => {
  const [on, setOn] = React.useState(checked)
  return (
    <label className={
      'inline-flex items-center gap-2'
      + ' cursor-pointer'
      + (disabled
        ? ' opacity-50 cursor-not-allowed' : '')
      + ` ${className}`
    }>
      <div
        className={
          'relative w-10 h-6 rounded-full'
          + ` transition-colors`
          + ` ${on ? 'bg-accent' : 'bg-muted'}`
        }
        onClick={() => !disabled && setOn(!on)}
      >
        <div className={
          'absolute top-1 w-4 h-4 rounded-full'
          + ' bg-white shadow transition-transform'
          + ` ${on ? 'translate-x-5'
            : 'translate-x-1'}`
        } />
      </div>
      {label && (
        <span className="text-sm">{label}</span>
      )}
    </label>
  )
}
