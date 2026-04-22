'use client'

import React, { forwardRef } from 'react'
import styles from '../../../scss/atoms/mat-card.module.scss'
import { sxToStyle } from '../utils/sx'

/** Props for the CardActionArea component */
export interface CardActionAreaProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Content rendered inside the clickable area */
  children?: React.ReactNode
  /** MUI sx prop for styling */
  sx?: Record<string, unknown>
  /** Render as different element */
  component?: React.ElementType
  /** Link target when rendered as an anchor-like component */
  href?: string
}

/**
 * CardActionArea - clickable card area wrapper.
 * Renders a semantic button that fills the card surface.
 */
export const CardActionArea = forwardRef<
  HTMLButtonElement,
  CardActionAreaProps
>(({ children, className = '', sx, style, component: Component = 'button', ...props }, ref) => {
  const classes = [
    styles.cardActionArea,
    className,
  ].filter(Boolean).join(' ')

  return (
    <Component
      ref={ref}
      className={classes}
      style={{ ...sxToStyle(sx), ...style }}
      data-testid="card-action-area"
      {...props}
    >
      {children}
    </Component>
  )
})

CardActionArea.displayName = 'CardActionArea'

export default CardActionArea
