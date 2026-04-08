/**
 * CircularClipCircle - SVG circle clipping
 * for indeterminate circular progress.
 */

import React from 'react'
import styles
  from '../../../scss/atoms/mat-progress.module.scss'

const s = (key: string): string =>
  styles[key] || key

/** Props for the clip circle helper. */
export interface ClipCircleProps {
  cls: string
  viewBox: number
  radius: number
  strokeWidth: number
  dashArray: string
  dashOffset: string
}

/** Single SVG clip circle for spinner. */
export const ClipCircle: React.FC<
  ClipCircleProps
> = ({
  cls, viewBox, radius,
  strokeWidth, dashArray, dashOffset,
}) => (
  <div className={cls}>
    <svg className={s(
      'mdc-circular-progress__indeterminate-circle-graphic'
    )} viewBox={
      `0 0 ${viewBox} ${viewBox}`
    }>
      <circle
        cx={viewBox / 2}
        cy={viewBox / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset} />
    </svg>
  </div>
)
