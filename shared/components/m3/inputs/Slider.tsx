'use client'

import React, { forwardRef, useState, useCallback, useMemo } from 'react'
import { classNames } from '../utils/classNames'
import styles from '../../../scss/atoms/mat-slider.module.scss'
import { SliderProps, SliderMark } from './SliderTypes'
import { SliderTrack } from './SliderTrack'
import { SliderThumb } from './SliderThumb'

export type { SliderMark, SliderProps } from './SliderTypes'

const s = (key: string): string => styles[key] || key
const colorMap: Record<string, string | undefined> = {
  primary: styles.sliderPrimary, secondary: styles.sliderSecondary,
  error: styles.sliderError, warning: styles.sliderWarning,
  info: styles.sliderInfo, success: styles.sliderSuccess,
}
const sizeMap: Record<string, string | undefined> = {
  small: styles.sliderSmall, medium: styles.sliderMedium,
}

/** Slider - range input with M3 styling */
export const Slider = forwardRef<HTMLInputElement, SliderProps>((props, ref) => {
  const {
    value: controlled, defaultValue = 0, min = 0, max = 100, step = 1,
    marks = false, valueLabelDisplay = 'off', valueLabelFormat = (v) => v,
    track = 'normal', orientation = 'horizontal', color = 'primary',
    size = 'medium', disabled = false, onChange, onChangeCommitted,
    onValueChange, testId, className = '',
    'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...rest
  } = props

  const [internal, setInternal] = useState(typeof defaultValue === 'number' ? defaultValue : (defaultValue[0] ?? 0))
  const [showLabel, setShowLabel] = useState(valueLabelDisplay === 'on')
  const [focused, setFocused] = useState(false)

  const value = controlled !== undefined ? (typeof controlled === 'number' ? controlled : (controlled[0] ?? 0)) : internal
  const pct = ((value - min) / (max - min)) * 100

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value)
    if (controlled === undefined) setInternal(v)
    onChange?.(e, v); onValueChange?.([v])
  }, [controlled, onChange, onValueChange])

  const computed = useMemo<SliderMark[]>(() => {
    if (!marks) return []
    if (marks === true) { const r: SliderMark[] = []; for (let v = min; v <= max; v += step) r.push({ value: v }); return r }
    return marks
  }, [marks, min, max, step])

  const root = classNames(s('mat-mdc-slider'), styles.matSlider, colorMap[color], sizeMap[size], {
    [s('mdc-slider--disabled')]: disabled, [s('mdc-slider--discrete')]: computed.length > 0,
    [styles.sliderVertical]: orientation === 'vertical', [styles.sliderTrackInverted]: track === 'inverted',
  }, className)

  return (
    <div className={root} data-testid={testId}
      onMouseEnter={() => valueLabelDisplay === 'auto' && setShowLabel(true)}
      onMouseLeave={() => valueLabelDisplay === 'auto' && setShowLabel(false)}>
      <SliderTrack track={track} orientation={orientation} percent={pct} marks={computed} min={min} max={max} value={value} />
      <SliderThumb orientation={orientation} percent={pct} isFocused={focused} showLabel={showLabel}
        valueLabelDisplay={valueLabelDisplay} valueLabelFormat={valueLabelFormat} value={value} />
      <input ref={ref} type="range" className={s('mdc-slider__input')} value={value} min={min} max={max} step={step}
        disabled={disabled} onChange={handleChange} onMouseUp={(e) => onChangeCommitted?.(e, value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        aria-label={ariaLabel} aria-labelledby={ariaLabelledBy}
        aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} aria-orientation={orientation} {...rest} />
    </div>
  )
})

Slider.displayName = 'Slider'
