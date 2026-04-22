import React from 'react'
import { sxToStyle } from '../utils/sx'
import styles
  from '../../../scss/atoms/typography.module.scss'
import { TypographyProps }
  from './TypographyTypes'
import {
  variantMap, colorMap, alignMap,
} from './typographyMaps'

export type {
  TypographyVariant, TypographyProps,
} from './TypographyTypes'

/** Typography - text with M3 styles. */
export const Typography: React.FC<
  TypographyProps
> = ({
  children, variant, color, align,
  gutterBottom, noWrap, paragraph,
  testId, className = '',
  fontWeight,
  as, component, sx, style, ...props
}) => {
  const isHeading =
    variant === 'h1' || variant === 'h2'
    || variant === 'h3' || variant === 'h4'
    || variant === 'h5' || variant === 'h6'
  const Tag = as || component
    || (isHeading ? variant! : 'p')
  const classes = [
    styles.typography,
    variant && variantMap[variant],
    color && colorMap[color],
    align && alignMap[align],
    gutterBottom
      && styles.typographyGutterBottom,
    paragraph
      && styles.typographyGutterBottom,
    noWrap && styles.typographyNoWrap,
    className,
  ].filter(Boolean).join(' ')
  return (
    <Tag className={classes}
      style={{
        fontWeight,
        ...sxToStyle(sx),
        ...style,
      }}
      data-testid={testId} {...props}>
      {children}
    </Tag>
  )
}

export default Typography
