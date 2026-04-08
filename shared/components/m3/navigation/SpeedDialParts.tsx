'use client'
/** SpeedDialAction and SpeedDialIcon sub-components. */

import React, { useState } from 'react'
import { classNames } from '../utils/classNames'
import type { SpeedDialActionProps, SpeedDialIconProps } from './SpeedDialTypes'

/** Individual action with tooltip and FAB button. */
export function SpeedDialAction({
  icon, tooltipTitle, tooltipOpen = false,
  tooltipPlacement = 'left', onClick, delay = 0,
  className, FabProps = {}, TooltipClasses = {},
  ...props
}: SpeedDialActionProps) {
  const [show, setShow] = useState(tooltipOpen)
  return (
    <div
      className={classNames('m3-speed-dial-action', className)}
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      {...props}
    >
      {(show || tooltipOpen) && tooltipTitle && (
        <span className={classNames(
          'm3-speed-dial-action-tooltip',
          `m3-speed-dial-action-tooltip-${tooltipPlacement}`,
          TooltipClasses.tooltip,
        )}>
          {tooltipTitle}
        </span>
      )}
      <button
        className={classNames('m3-speed-dial-action-fab', FabProps.className)}
        onClick={onClick} aria-label={tooltipTitle}
        {...FabProps}
      >
        {icon}
      </button>
    </div>
  )
}

/** Animated icon that switches on open state. */
export function SpeedDialIcon({
  icon, openIcon, open = false, className, ...props
}: SpeedDialIconProps) {
  return (
    <span
      className={classNames('m3-speed-dial-icon', className, { 'm3-speed-dial-icon-open': open })}
      {...props}
    >
      {open && openIcon ? openIcon : icon || '+'}
    </span>
  )
}
