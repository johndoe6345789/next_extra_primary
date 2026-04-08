'use client'

import { useState, useEffect, useRef } from 'react'
import { calculatePopperPosition }
  from './popperPosition'
import type { PopperPlacement }
  from './popperTypes'

/**
 * Hook to manage Popper position updates.
 * @param open - Whether popper is visible.
 * @param anchorEl - Anchor element or getter.
 * @param placement - Desired placement.
 * @returns Position, placement, and element ref.
 */
export function usePopperPosition(
  open: boolean,
  anchorEl:
    | HTMLElement
    | (() => HTMLElement)
    | null
    | undefined,
  placement: PopperPlacement
) {
  const [position, setPosition] = useState({
    top: 0, left: 0,
  })
  const [actualPlacement, setActualPlacement] =
    useState<PopperPlacement>(placement)
  const elRef =
    useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open || !anchorEl) return
    const update = () => {
      const anchor =
        typeof anchorEl === 'function'
          ? anchorEl()
          : anchorEl
      if (!anchor) return
      const aRect =
        anchor.getBoundingClientRect()
      const pRect =
        elRef.current?.getBoundingClientRect()
          || { width: 0, height: 0 }
      const pos = calculatePopperPosition(
        aRect, pRect, placement
      )
      setPosition(pos)
      setActualPlacement(placement)
    }
    update()
    window.addEventListener(
      'scroll', update, true
    )
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener(
        'scroll', update, true
      )
      window.removeEventListener(
        'resize', update
      )
    }
  }, [open, anchorEl, placement])

  return { position, actualPlacement, elRef }
}
