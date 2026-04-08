'use client';
/**
 * Card - Material Design 3 card container with
 * variant support. Re-exports all sub-components.
 */

import React, { forwardRef } from 'react'
import { sxToStyle } from '../utils/sx'
import styles from '../../../scss/atoms/mat-card.module.scss'
import type { CardProps } from './CardTypes'

export type {
  CardProps,
  CardHeaderProps,
  CardContentProps,
  CardActionsProps,
  CardActionAreaProps,
  CardMediaProps,
  CardTitleProps,
  CardDescriptionProps,
  CardFooterProps,
  CardTitleGroupProps,
} from './CardTypes'

export {
  CardHeader,
  CardContent,
  CardActions,
  CardActionArea,
  CardMedia,
  CardTitle,
  CardDescription,
  CardFooter,
  CardTitleGroup,
} from './CardParts'

const s = (key: string): string => styles[key] || key

/** Card container with elevation/outlined/filled variants. */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      clickable,
      raised,
      variant = 'elevation',
      className = '',
      sx,
      style,
      ...props
    },
    ref,
  ) => {
    const vc =
      variant === 'outlined'
        ? s('mat-mdc-card-outlined')
        : variant === 'filled'
          ? s('mat-mdc-card-filled')
          : ''

    const cls = [
      s('mat-mdc-card'),
      vc,
      clickable ? styles.clickable : '',
      raised ? styles.raised : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        ref={ref}
        className={cls}
        style={{ ...sxToStyle(sx), ...style }}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'

export default Card
