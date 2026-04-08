/**
 * Determinate/indeterminate circular progress
 * SVG rendering.
 */

import React from 'react'
import styles
  from '../../../scss/atoms/mat-progress.module.scss'
import { ClipCircle }
  from './CircularClipCircle'

const s = (key: string): string =>
  styles[key] || key

/** Props for DeterminateCircle. */
export interface DeterminateCircleProps {
  viewBox: number; radius: number
  thickness: number
  dashArray: string; dashOffset: string
}

/** Single SVG for determinate progress. */
export const DeterminateCircle: React.FC<
  DeterminateCircleProps
> = ({
  viewBox, radius, thickness,
  dashArray, dashOffset,
}) => (
  <div className={s(
    'mdc-circular-progress__determinate-container'
  )}>
    <svg className={s(
      'mdc-circular-progress__determinate-circle-graphic'
    )} viewBox={
      `0 0 ${viewBox} ${viewBox}`
    }>
      <circle className={s(
        'mdc-circular-progress__determinate-circle'
      )} cx={viewBox / 2} cy={viewBox / 2}
        r={radius} fill="none"
        strokeWidth={thickness}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset} />
    </svg>
  </div>
)

/** Props for IndeterminateCircle. */
export interface IndeterminateCircleProps {
  viewBox: number; radius: number
  thickness: number
  dashArray: string; dashOffset: string
}

/** Spinner layer with clippers. */
export const IndeterminateCircle: React.FC<
  IndeterminateCircleProps
> = ({
  viewBox, radius, thickness,
  dashArray, dashOffset,
}) => (
  <div className={s(
    'mdc-circular-progress__indeterminate-container'
  )}>
    <div className={s(
      'mdc-circular-progress__spinner-layer'
    )}>
      <ClipCircle cls={
        `${s('mdc-circular-progress__circle-clipper')} ${s('mdc-circular-progress__circle-left')}`
      } viewBox={viewBox} radius={radius}
        strokeWidth={thickness}
        dashArray={dashArray}
        dashOffset={dashOffset} />
      <ClipCircle cls={s(
        'mdc-circular-progress__gap-patch'
      )} viewBox={viewBox} radius={radius}
        strokeWidth={thickness * 0.8}
        dashArray={dashArray}
        dashOffset={dashOffset} />
      <ClipCircle cls={
        `${s('mdc-circular-progress__circle-clipper')} ${s('mdc-circular-progress__circle-right')}`
      } viewBox={viewBox} radius={radius}
        strokeWidth={thickness}
        dashArray={dashArray}
        dashOffset={dashOffset} />
    </div>
  </div>
)
