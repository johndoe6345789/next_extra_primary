'use client';
/** CardMedia - Image or background section. */

import React from 'react'
import styles
  from '../../../scss/atoms/mat-card.module.scss'
import type { CardMediaProps }
  from './CardTypes'

const s = (key: string): string =>
  styles[key] || key

/** Image or background media section. */
export const CardMedia: React.FC<
  CardMediaProps
> = ({
  image, alt = '', height,
  component = 'div', className = '',
  style, ...props
}) => {
  if (component === 'img' && image) {
    return (
      <img src={image} alt={alt}
        className={
          `${s('mdc-card__media')} ${className}`
        }
        style={{
          height, objectFit: 'cover',
          width: '100%', ...style,
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
      height, ...style,
    }} {...props} role="img"
      aria-label={alt} />
  )
}
