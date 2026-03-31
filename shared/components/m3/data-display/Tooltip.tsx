'use client';
import React, { useId } from 'react'

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'title'> {
  children?: React.ReactNode
  title?: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
    | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end'
    | 'left-start' | 'left-end' | 'right-start' | 'right-end'
  arrow?: boolean
}

export const Tooltip: React.FC<TooltipProps> = ({ children, title, placement = 'top', arrow: _arrow, className = '', ...props }) => {
  const tooltipId = useId()

  return (
    <span
      className={`tooltip-wrapper ${className}`}
      data-tooltip={title}
      data-placement={placement}
      aria-describedby={title ? tooltipId : undefined}
      {...props}
    >
      {children}
      {title && (
        <span id={tooltipId} role="tooltip" style={{
          position: 'absolute', width: '1px', height: '1px',
          overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap'
        }}>
          {title}
        </span>
      )}
    </span>
  )
}

export default Tooltip