/**
 * Dialog/modal components for JSON registry.
 */

import React from 'react'
import type { ComponentProps } from './registryTypes'

const MAX_W = {
  xs: 'max-w-xs', sm: 'max-w-sm',
  md: 'max-w-md', lg: 'max-w-lg',
  xl: 'max-w-xl',
}

/** Dialog overlay. */
export const Dialog: React.FC<
  ComponentProps & {
    open?: boolean
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  }
> = ({ children, className = '', maxWidth = 'sm' }) => (
  <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`}>
    <div className={`bg-canvas rounded-lg shadow-xl ${MAX_W[maxWidth]} w-full mx-4`}>
      {children}
    </div>
  </div>
)

/** Dialog title bar. */
export const DialogTitle: React.FC<ComponentProps> = ({
  children,
  className = 'px-6 py-4 border-b font-semibold text-lg flex items-center gap-2',
}) => <div className={className}>{children}</div>

/** Dialog body. */
export const DialogContent: React.FC<
  ComponentProps
> = ({
  children, className = 'px-6 py-4',
}) => <div className={className}>{children}</div>

/** Dialog action buttons. */
export const DialogActions: React.FC<
  ComponentProps
> = ({
  children,
  className = 'px-6 py-4 border-t flex justify-end gap-2',
}) => <div className={className}>{children}</div>
