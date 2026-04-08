'use client';
/**
 * Card extras: ActionArea, Title,
 * Description, Footer, TitleGroup.
 */

import React, { forwardRef } from 'react'
import { sxToStyle } from '../utils/sx'
import styles
  from '../../../scss/atoms/mat-card.module.scss'
import type {
  CardActionAreaProps,
  CardTitleProps, CardDescriptionProps,
  CardFooterProps, CardTitleGroupProps,
} from './CardTypes'

const s = (key: string): string =>
  styles[key] || key

/** Clickable area wrapping card content. */
export const CardActionArea = forwardRef<
  HTMLButtonElement, CardActionAreaProps
>(({ children, className = '', sx,
  style, component: C = 'button',
  ...props }, ref) => (
  <C ref={ref} className={
    `${styles.cardActionArea} ${className}`
  } style={{
    ...sxToStyle(sx), ...style,
  }} {...props}>{children}</C>
))
CardActionArea.displayName = 'CardActionArea'

export { CardMedia } from './CardMedia'

/** Simple title heading. */
export const CardTitle: React.FC<
  CardTitleProps
> = ({ children, text, className = '',
  ...props }) => (
  <h3 className={
    `${s('mat-mdc-card-title')} ${className}`
  } {...props}>{text || children}</h3>
)

/** Description paragraph. */
export const CardDescription: React.FC<
  CardDescriptionProps
> = ({ children, text, className = '',
  ...props }) => (
  <p className={
    `${s('mat-mdc-card-subtitle')} ${className}`
  } {...props}>{text || children}</p>
)

/** Footer area. */
export const CardFooter: React.FC<
  CardFooterProps
> = ({ children, className = '',
  ...props }) => (
  <div className={
    `${styles.cardFooter} ${className}`
  } {...props}>{children}</div>
)

/** Title group for complex layouts. */
export const CardTitleGroup: React.FC<
  CardTitleGroupProps
> = ({ children, className = '',
  ...props }) => (
  <div className={
    `${s('mat-mdc-card-title-group')} ${className}`
  } {...props}>{children}</div>
)
