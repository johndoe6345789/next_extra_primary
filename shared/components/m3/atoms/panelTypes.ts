import type React from 'react'

/** Panel visual style variants. */
export type PanelVariant =
  | 'default' | 'elevated' | 'outlined'

/** Fixed position options for panels. */
export type PanelFixedPosition =
  | 'br' | 'bl' | 'tr' | 'tl'

/** Props for the Panel component. */
export interface PanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  /** Panel visual style */
  variant?: PanelVariant
  /** Fixed position on screen */
  fixedPosition?: PanelFixedPosition
  /** Enable collapsible behavior */
  collapsible?: boolean
  /** Collapsed state (requires collapsible) */
  collapsed?: boolean
  /** Test ID for automated testing */
  testId?: string
}
