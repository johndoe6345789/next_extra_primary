'use client';
/** CardMedia - Image or background section. */

import React from 'react'
import styles
  from '../../../scss/atoms/mat-card.module.scss'
import type { CardMediaProps }
  from './CardTypes'
import { sxToStyle } from '../utils/sx'

const s = (key: string): string =>
  styles[key] || key

/** Image or background media section. */
export const CardMedia: React.FC<
  CardMediaProps
> = ({
  image, alt = '', height,
  component = 'div', className = '',
  style, sx, ...props
}) => {
  if (component === 'img' && image) {
    return (
      <img src={image} alt={alt}
        className={
          `${s('mdc-card__media')} ${className}`
        }
        style={{
          height, objectFit: 'cover',
          width: '100%',
          ...sxToStyle(sx),
          ...style,
        }}
        {...(props as React.ImgHTMLAttributes<
          HTMLImageElement
        >)} />
    )
  }
  return (
    <div className={
      `${s('mdc-card__media')} ${className}`
    } style={{
      backgroundImage: image
        ? `url(${image})` : undefined,
      height,
      ...sxToStyle(sx),
      ...style,
    }} {...props} role="img"
      aria-label={alt} />
  )
}
