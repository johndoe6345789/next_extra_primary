/**
 * MenuPanel - the positioned popup container
 * for Menu. Renders inside a portal with
 * backdrop.
 */

import React from 'react'
import { classNames } from '../utils/classNames'
import { Backdrop } from '../feedback/Backdrop'
import styles
  from '../../../scss/atoms/mat-menu.module.scss'
import {
  buildMultiColumnStyle, buildPanelStyle,
} from './menuPanelStyles'

const s = (key: string): string =>
  styles[key] || key

/** Props for the positioned menu panel */
export interface MenuPanelProps {
  menuRef: React.RefObject<
    HTMLDivElement | null
  >
  position: React.CSSProperties
  anchorRight?: boolean
  anchorBottom?: boolean
  dense?: boolean
  multiColumn?: boolean
  columnHeight?: number
  testId?: string
  className?: string
  style?: React.CSSProperties
  onClose?: () => void
  children?: React.ReactNode
}

/** Backdrop + positioned panel with content. */
export const MenuPanel: React.FC<
  MenuPanelProps
> = ({
  menuRef, position, anchorRight,
  anchorBottom, dense, multiColumn,
  columnHeight, testId, className,
  style, onClose, children,
}) => {
  const mcStyle = multiColumn
    ? buildMultiColumnStyle(columnHeight)
    : undefined
  const panelStyle = buildPanelStyle(
    position, multiColumn, style)
  return (
    <>
      <Backdrop open invisible
        onClick={onClose} />
      <div
        ref={menuRef}
        className={classNames(
          s('mat-mdc-menu-panel'),
          styles.matMenu,
          {
            [styles.menuRight]: anchorRight,
            [styles.menuBottom]: anchorBottom,
            [styles.menuDense]: dense,
            [styles.menuMultiColumn]:
              multiColumn,
          },
          className,
        )}
        role="menu"
        data-testid={testId}
        style={panelStyle}
      >
        <div
          className={
            s('mat-mdc-menu-content')
          }
          style={mcStyle}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export default MenuPanel
