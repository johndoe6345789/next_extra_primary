'use client'

import React from 'react'
import { sxToStyle } from '../utils/sx'
import styles from '../../../scss/atoms/mat-card.module.scss'

const s = (key: string): string => styles[key] || key

/** Props for the CardContent component */
export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Content rendered inside the card body */
  children?: React.ReactNode
  /** Inline style overrides via sx map */
  sx?: Record<string, unknown>
}

/**
 * CardContent - card content container with padding.
 * Wraps the main body area of a Card.
 */
export const CardContent: React.FC<CardContentProps> = ({
  children,
  className = '',
  sx,
  style,
  ...props
}) => (
  <div
    className={`${s('mat-mdc-card-content')} ${className}`}
    style={{ ...sxToStyle(sx), ...style }}
    data-testid="card-content"
    {...props}
  >
    {children}
  </div>
)

export default CardContent
