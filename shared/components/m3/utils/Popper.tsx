'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { classNames } from './classNames'
import { usePopperPosition }
  from './usePopperPosition'
import type { PopperProps } from './popperTypes'

export type {
  PopperPlacement, PopperChildrenProps,
  PopperProps,
} from './popperTypes'

/**
 * Popper - Low-level floating element
 * positioner using portal rendering.
 */
export function Popper({
  anchorEl, children, container,
  disablePortal = false,
  keepMounted = false, open = false,
  placement = 'bottom', popperRef,
  transition = false,
  className, style, testId, ...props
}: PopperProps) {
  const { position, actualPlacement, elRef } =
    usePopperPosition(open, anchorEl, placement)

  if (!open && !keepMounted) return null

  const content = (
    <div
      ref={(node) => {
        elRef.current = node
        if (popperRef) {
          if (typeof popperRef === 'function')
            popperRef(node)
          else
            (popperRef as React.MutableRefObject<
              HTMLDivElement | null
            >).current = node
        }
      }}
      className={classNames(
        'm3-popper', className,
        { 'm3-popper-hidden': !open }
      )}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
        ...style,
      }}
      data-popper-placement={actualPlacement}
      data-testid={testId}
      {...props}
    >
      {typeof children === 'function'
        ? children({
            placement: actualPlacement,
            TransitionProps: transition
              ? { in: open }
              : undefined,
          })
        : children}
    </div>
  )

  if (disablePortal) return content

  const containerEl = container
    ? typeof container === 'function'
      ? container()
      : container
    : document.body

  return createPortal(content, containerEl)
}

export default Popper
