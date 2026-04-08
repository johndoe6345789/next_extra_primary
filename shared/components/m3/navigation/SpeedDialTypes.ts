/**
 * Type definitions for SpeedDial components.
 */
import type React from 'react'

/** Props for the SpeedDial container */
export interface SpeedDialProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onMouseEnter' | 'onMouseLeave'
  > {
  ariaLabel?: string
  children?: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  hidden?: boolean
  icon?: React.ReactNode
  onClose?: () => void
  onOpen?: () => void
  open?: boolean
  openIcon?: React.ReactNode
  FabProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  /** Test ID for automated testing */
  testId?: string
}

/** Props for a single speed dial action button */
export interface SpeedDialActionProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onClick'
  > {
  icon?: React.ReactNode
  tooltipTitle?: string
  tooltipOpen?: boolean
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right'
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void
  delay?: number
  FabProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  TooltipClasses?: { tooltip?: string }
}

/** Props for the SpeedDial icon */
export interface SpeedDialIconProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode
  openIcon?: React.ReactNode
  open?: boolean
}
