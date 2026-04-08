'use client'

import React from 'react'
import styles
  from '../../../scss/atoms/mat-slider.module.scss'

const s = (key: string): string =>
  styles[key] || key

/** Props for SliderValueIndicator. */
export interface SliderValueIndicatorProps {
  value: number
  valueLabelFormat: (
    value: number
  ) => React.ReactNode
}

/** Tooltip-style value indicator for thumb. */
export function SliderValueIndicator({
  value, valueLabelFormat,
}: SliderValueIndicatorProps) {
  return (
    <div className={s(
      'mdc-slider__value-indicator-container'
    )}>
      <div className={s(
        'mdc-slider__value-indicator'
      )}>
        <span className={s(
          'mdc-slider__value-indicator-text'
        )}>
          {valueLabelFormat(value)}
        </span>
      </div>
    </div>
  )
}
