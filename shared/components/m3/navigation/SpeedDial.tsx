'use client'
/** SpeedDial - expandable FAB with directional actions. */

import React, { useState } from 'react'
import { classNames } from '../utils/classNames'
import type { SpeedDialProps } from './SpeedDialTypes'

export type { SpeedDialProps } from './SpeedDialTypes'
export { SpeedDialAction, SpeedDialIcon } from './SpeedDialParts'
export type { SpeedDialActionProps, SpeedDialIconProps } from './SpeedDialTypes'

/** Expandable floating action button. */
export function SpeedDial({
  ariaLabel, children, direction = 'up',
  hidden = false, icon, onClose, onOpen,
  open: controlledOpen, openIcon,
  className, FabProps = {}, testId, ...props
}: SpeedDialProps) {
  const [internal, setInternal] = useState(false)
  const isOpen = controlledOpen ?? internal

  const toggle = () => {
    if (controlledOpen === undefined) setInternal(!internal)
    if (isOpen) onClose?.()
    else onOpen?.()
  }
  const enter = () => {
    if (controlledOpen === undefined) setInternal(true)
    onOpen?.()
  }
  const leave = () => {
    if (controlledOpen === undefined) setInternal(false)
    onClose?.()
  }

  return (
    <div
      className={classNames(
        'm3-speed-dial',
        `m3-speed-dial-direction-${direction}`,
        className,
        { 'm3-speed-dial-hidden': hidden, 'm3-speed-dial-open': isOpen },
      )}
      onMouseEnter={enter}
      onMouseLeave={leave}
      aria-label={ariaLabel}
      data-testid={testId}
      {...props}
    >
      <button
        className={classNames('m3-speed-dial-fab', FabProps.className)}
        onClick={toggle}
        aria-expanded={isOpen}
        {...FabProps}
      >
        {isOpen && openIcon ? openIcon : icon}
      </button>
      <div className="m3-speed-dial-actions">
        {isOpen && children}
      </div>
    </div>
  )
}

export default SpeedDial
