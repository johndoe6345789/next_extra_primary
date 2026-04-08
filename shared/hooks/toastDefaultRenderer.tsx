'use client'

/**
 * Default styled toast component
 */

import React from 'react'
import type { Toast } from './toastTypes'
import {
  severityColors,
  positionStyles,
} from './toastStyles'

interface DefaultToastProps {
  toast: Toast
  onClose: () => void
}

/** Default toast renderer component */
export const DefaultToast: React.FC<
  DefaultToastProps
> = ({ toast, onClose }) => {
  const colors = severityColors[toast.severity]
  const posKey =
    `${toast.anchorOrigin.vertical}-` +
    `${toast.anchorOrigin.horizontal}`
  const pos =
    positionStyles[posKey] ||
    positionStyles['bottom-left']

  return (
    <div
      role="alert"
      aria-live={
        toast.severity === 'error'
          ? 'assertive'
          : 'polite'
      }
      style={{
        position: 'fixed',
        ...pos,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 16px',
        borderRadius: 4,
        boxShadow:
          '0 2px 8px rgba(0,0,0,0.15)',
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        fontFamily:
          'system-ui, -apple-system, sans-serif',
        fontSize: 14,
        lineHeight: 1.4,
        maxWidth: 400,
        minWidth: 200,
      }}
    >
      <span style={{ flex: 1 }}>
        {toast.message}
      </span>
      {toast.action && (
        <div style={{ marginLeft: 8 }}>
          {toast.action}
        </div>
      )}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        style={{
          background: 'none',
          border: 'none',
          padding: 4,
          cursor: 'pointer',
          color: colors.text,
          opacity: 0.7,
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  )
}
