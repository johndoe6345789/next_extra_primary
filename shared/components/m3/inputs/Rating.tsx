'use client'

import React, { useState } from 'react'
import { classNames } from '../utils/classNames'
import { RatingProps } from './RatingTypes'
import { RatingIcon } from './RatingIcon'

export type { RatingProps } from './RatingTypes'

/** Rating - star-based rating input */
export function Rating({
  value = 0, onChange, max = 5, precision = 1, size = 'medium',
  disabled = false, readOnly = false, name, emptyIcon = '\u2606',
  icon = '\u2605', highlightSelectedOnly = false, testId, className, ...props
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number>(-1)
  const display = hoverValue >= 0 ? hoverValue : value

  const handleClick = (v: number) => {
    if (disabled || readOnly) return
    onChange?.(null, v === value ? 0 : v)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    if (disabled || readOnly) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    setHoverValue(precision === 0.5 ? index + (pct < 0.5 ? 0.5 : 1) : index + 1)
  }

  return (
    <span
      className={classNames('m3-rating', `m3-rating-size-${size}`, className, {
        'm3-rating-disabled': disabled, 'm3-rating-readonly': readOnly,
      })}
      onMouseLeave={() => setHoverValue(-1)} role="slider"
      aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}
      data-testid={testId} {...props}>
      {name && <input type="hidden" name={name} value={value} />}
      {Array.from({ length: max }, (_, i) => (
        <RatingIcon key={i} index={i} displayValue={display} icon={icon} emptyIcon={emptyIcon}
          onMouseMove={(e) => handleMouseMove(e, i)} onClick={() => handleClick(i + 1)} />
      ))}
    </span>
  )
}

export default Rating
