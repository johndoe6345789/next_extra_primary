/**
 * LinearProgressBars - inner bar structure
 * for the LinearProgress component.
 */

import React from 'react'
import styles
  from '../../../scss/atoms/mat-progress.module.scss'

const s = (key: string): string =>
  styles[key] || key

/** Props for inner progress bars. */
export interface LinearBarProps {
  ev: string
  cv: number
  cb?: number
  indet: boolean
}

/** Buffer, primary, and secondary bars. */
export const LinearProgressBars: React.FC<
  LinearBarProps
> = ({ ev, cv, cb, indet }) => (
  <>
    <div className={
      s('mdc-linear-progress__buffer')
    }>
      <div className={
        s('mdc-linear-progress__buffer-bar')
      } style={
        ev === 'buffer' && cb !== undefined
          ? { flexBasis: `${cb}%` }
          : undefined
      } />
      <div className={
        s('mdc-linear-progress__buffer-dots')
      } />
    </div>
    <div className={
      `${s('mdc-linear-progress__bar')} ${s('mdc-linear-progress__primary-bar')}`
    } style={!indet
      ? { transform: `scaleX(${cv / 100})` }
      : undefined}>
      <span className={
        s('mdc-linear-progress__bar-inner')
      } />
    </div>
    <div className={
      `${s('mdc-linear-progress__bar')} ${s('mdc-linear-progress__secondary-bar')}`
    }>
      <span className={
        s('mdc-linear-progress__bar-inner')
      } />
    </div>
  </>
)
