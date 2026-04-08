import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { MenuProps } from './MenuTypes'
import { MenuPanel } from './MenuPanel'
import { useEscapeClose, useArrowNav } from './useMenuKeyboard'

export type { MenuProps, MenuItemProps, MenuListProps, MenuDividerProps, MenuSubheaderProps } from './MenuTypes'
export { MenuItem, MenuList, MenuDivider, MenuSubheader } from './MenuItems'

const EDGE_GAP = 8
const ANCHOR_GAP = 4

/** Menu popup anchored to a reference element. */
export const Menu: React.FC<MenuProps> = ({
  children, open, anchorEl, onClose, anchorRight,
  anchorBottom, dense, multiColumn, columnHeight,
  testId, className, style, ...props
}) => {
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<React.CSSProperties>(
    { position: 'fixed', visibility: 'hidden' },
  )

  useEffect(() => { setMounted(true) }, [])
  useEscapeClose(open, onClose)
  useArrowNav(open, menuRef)

  useLayoutEffect(() => {
    if (!open || !mounted) return
    const el = menuRef.current
    if (!el) return
    const r = anchorEl?.getBoundingClientRect()
    const m = el.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    let top = r ? r.bottom + ANCHOR_GAP : EDGE_GAP
    if (top + m.height > vh - EDGE_GAP) {
      const f = r ? r.top - m.height - ANCHOR_GAP : EDGE_GAP
      top = f >= EDGE_GAP ? f : Math.max(EDGE_GAP, vh - m.height - EDGE_GAP)
    }
    let left: number | undefined
    let right: number | undefined
    if (anchorRight) {
      right = r ? vw - r.right : EDGE_GAP
      if (right + m.width > vw - EDGE_GAP) right = Math.max(EDGE_GAP, vw - m.width - EDGE_GAP)
    } else {
      left = r ? r.left : EDGE_GAP
      if (left + m.width > vw - EDGE_GAP) left = Math.max(EDGE_GAP, vw - m.width - EDGE_GAP)
    }
    setPos({ position: 'fixed', top, ...(anchorRight ? { right } : { left }), visibility: 'visible' })
  }, [open, mounted, anchorEl, anchorRight])

  if (!open || !mounted) return null

  return createPortal(
    <MenuPanel
      menuRef={menuRef} position={pos}
      anchorRight={anchorRight} anchorBottom={anchorBottom}
      dense={dense} multiColumn={multiColumn}
      columnHeight={columnHeight} testId={testId}
      className={className} style={style}
      onClose={onClose} {...props}
    >
      {children}
    </MenuPanel>,
    document.body,
  )
}

export default Menu
