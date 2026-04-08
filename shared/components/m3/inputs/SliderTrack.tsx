'use client'

import React from 'react'
import styles from '../../../scss/atoms/mat-slider.module.scss'
import { SliderMark } from './SliderTypes'

const s = (key: string): string =>
  styles[key] || key

/**
 * Props for the SliderTrack sub-component
 */
interface SliderTrackProps {
  track: 'normal' | 'inverted' | false
  orientation: 'horizontal' | 'vertical'
  percent: number
  marks: SliderMark[]
  min: number
  max: number
  value: number
}

/**
 * SliderTrack - renders the track, fill, and marks
 */
export function SliderTrack({
  track,
  orientation,
  percent,
  marks,
  min,
  max,
  value,
}: SliderTrackProps) {
  const fill =
    orientation === 'horizontal'
      ? track === 'inverted'
        ? `scaleX(${(100 - percent) / 100})`
        : `scaleX(${percent / 100})`
      : track === 'inverted'
        ? `scaleY(${(100 - percent) / 100})`
        : `scaleY(${percent / 100})`

  return (
    <div className={s('mdc-slider__track')}>
      <div
        className={s('mdc-slider__track--inactive')}
      />
      {track !== false && (
        <div
          className={s('mdc-slider__track--active')}
        >
          <div
            className={s(
              'mdc-slider__track--active_fill'
            )}
            style={{ transform: fill }}
          />
        </div>
      )}
      {marks.length > 0 && (
        <div className={s('mdc-slider__tick-marks')}>
          {marks.map((mark) => {
            const active =
              track === 'inverted'
                ? mark.value >= value
                : mark.value <= value
            return (
              <div
                key={mark.value}
                className={
                  active
                    ? s(
                        'mdc-slider__tick-mark--active'
                      )
                    : s(
                        'mdc-slider__tick-mark--inactive'
                      )
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
