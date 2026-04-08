'use client'

import React from 'react'
import { classNames } from '../utils/classNames'

/**
 * Props for the RatingIcon sub-component
 */
interface RatingIconProps {
  index: number
  displayValue: number
  icon: React.ReactNode
  emptyIcon: React.ReactNode
  onMouseMove: (
    e: React.MouseEvent<HTMLSpanElement>
  ) => void
  onClick: () => void
}

/**
 * Single star/icon in a Rating component
 */
export function RatingIcon({
  index,
  displayValue,
  icon,
  emptyIcon,
  onMouseMove,
  onClick,
}: RatingIconProps) {
  const filled = displayValue >= index + 1
  const half =
    displayValue >= index + 0.5 &&
    displayValue < index + 1

  return (
    <span
      className={classNames('m3-rating-icon', {
        'm3-rating-icon-filled': filled,
        'm3-rating-icon-half': half,
        'm3-rating-icon-empty': !filled && !half,
      })}
      onMouseMove={onMouseMove}
      onClick={onClick}
    >
      {half ? (
        <span className="m3-rating-icon-half-container">
          <span className="m3-rating-icon-half-filled">
            {icon}
          </span>
          <span className="m3-rating-icon-half-empty">
            {emptyIcon}
          </span>
        </span>
      ) : filled ? (
        icon
      ) : (
        emptyIcon
      )}
    </span>
  )
}
