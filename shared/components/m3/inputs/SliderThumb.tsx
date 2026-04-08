'use client'

import React from 'react'
import { classNames } from '../utils/classNames'
import styles
  from '../../../scss/atoms/mat-slider.module.scss'
import { SliderValueIndicator }
  from './SliderValueIndicator'

const s = (key: string): string =>
  styles[key] || key

/** Props for the SliderThumb component */
interface SliderThumbProps {
  orientation: 'horizontal' | 'vertical'
  percent: number
  isFocused: boolean
  showLabel: boolean
  valueLabelDisplay: 'auto' | 'on' | 'off'
  valueLabelFormat: (
    value: number
  ) => React.ReactNode
  value: number
}

/** Draggable thumb knob for the Slider. */
export function SliderThumb({
  orientation, percent, isFocused,
  showLabel, valueLabelDisplay,
  valueLabelFormat, value,
}: SliderThumbProps) {
  const thumbStyle =
    orientation === 'horizontal'
      ? { left: `calc(${percent}% - 24px)` }
      : { bottom: `calc(${percent}% - 24px)` }
  const showIndicator =
    showLabel || valueLabelDisplay === 'on'
  return (
    <div className={classNames(
      s('mdc-slider__thumb'), {
        [s('mdc-slider__thumb--focused')]:
          isFocused,
        [s('mdc-slider__thumb--with-indicator')]:
          showIndicator,
      })} style={thumbStyle}>
      {showIndicator && (
        <SliderValueIndicator
          value={value}
          valueLabelFormat={
            valueLabelFormat
          } />
      )}
      <div className={
        s('mdc-slider__thumb-knob')
      } />
      <div className={s('mat-ripple')}>
        {isFocused && (
          <div className={classNames(
            s('mat-ripple-element'),
            s('mat-mdc-slider-focus-ripple')
          )} />
        )}
      </div>
      <div className={
        s('mat-focus-indicator')
      } />
    </div>
  )
}
