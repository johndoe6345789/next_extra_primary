'use client';
/**
 * Card sub-components: Header, Content,
 * Actions, and ActionArea.
 */

import React from 'react'
import { sxToStyle } from '../utils/sx'
import styles
  from '../../../scss/atoms/mat-card.module.scss'
import type {
  CardHeaderProps, CardContentProps,
  CardActionsProps,
} from './CardTypes'

const s = (key: string): string =>
  styles[key] || key

/** Header with avatar, title, action. */
export const CardHeader: React.FC<
  CardHeaderProps
> = ({
  title, subheader, action, avatar,
  className = '', ...props
}) => (
  <div className={
    `${s('mat-mdc-card-header')} ${className}`
  } {...props}>
    {avatar && <div className={
      s('mat-mdc-card-avatar')
    }>{avatar}</div>}
    <div className={
      `${s('mat-mdc-card-header-text')} ${styles.cardHeaderText}`
    }>
      {title && <div className={
        s('mat-mdc-card-title')
      }>{title}</div>}
      {subheader && <div className={
        s('mat-mdc-card-subtitle')
      }>{subheader}</div>}
    </div>
    {action && <div className={
      styles.cardHeaderAction
    }>{action}</div>}
  </div>
)

/** Body content area. */
export const CardContent: React.FC<
  CardContentProps
> = ({
  children, className = '',
  sx, style, ...props
}) => (
  <div className={
    `${s('mat-mdc-card-content')} ${className}`
  } style={{
    ...sxToStyle(sx), ...style,
  }} {...props}>{children}</div>
)

/** Action buttons row. */
export const CardActions: React.FC<
  CardActionsProps
> = ({
  children, disableSpacing,
  className = '', sx, style, ...props
}) => (
  <div className={[
    s('mat-mdc-card-actions'),
    disableSpacing
      ? styles.actionsNoSpacing : '',
    className,
  ].filter(Boolean).join(' ')}
    style={{
      ...sxToStyle(sx), ...style,
    }} {...props}>{children}</div>
)

export {
  CardActionArea,
  CardMedia, CardTitle, CardDescription,
  CardFooter, CardTitleGroup,
} from './CardPartsExtras'
