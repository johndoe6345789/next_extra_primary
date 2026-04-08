/**
 * LinearProgress - horizontal bar with
 * buffer, query, label, and size support.
 */

import React from 'react'
import styles
  from '../../../scss/atoms/mat-progress.module.scss'
import type { LinearProgressProps }
  from './ProgressTypes'
import {
  progressColorMap, progressSizeMap,
} from './progressMaps'
import { LinearProgressBars }
  from './LinearProgressBars'

const s = (key: string): string =>
  styles[key] || key

/** Full-featured horizontal progress bar. */
export const LinearProgress: React.FC<
  LinearProgressProps
> = ({
  value = 0, valueBuffer, variant,
  color = 'primary', indeterminate,
  showLabel = false, size = 'default',
  className = '', testId, ...props
}) => {
  const ev = variant || (indeterminate
    ? 'indeterminate' : 'determinate')
  const cv = Math.min(100, Math.max(0, value))
  const cb = valueBuffer !== undefined
    ? Math.min(100, Math.max(0, valueBuffer))
    : undefined
  const indet =
    ev === 'indeterminate' || ev === 'query'
  const cls = [
    s('mat-mdc-progress-bar'),
    s('mdc-linear-progress'),
    styles.matProgress,
    progressColorMap[color] || '',
    progressSizeMap[size] || '',
    indet
      ? `${s('mdc-linear-progress--indeterminate')} ${s('mdc-linear-progress--animation-ready')}`
      : '',
    className,
  ].filter(Boolean).join(' ')
  const bar = (
    <div className={cls}
      data-testid={testId}
      role="progressbar"
      aria-valuenow={
        !indet ? cv : undefined}
      aria-valuemin={0}
      aria-valuemax={100}
      data-mode={ev} {...props}>
      <LinearProgressBars
        ev={ev} cv={cv}
        cb={cb} indet={indet} />
    </div>
  )
  if (showLabel) {
    return (
      <div className={styles.withLabel}>
        {bar}
        <span className={styles.label}>
          {Math.round(cv)}%
        </span>
      </div>
    )
  }
  return bar
}
