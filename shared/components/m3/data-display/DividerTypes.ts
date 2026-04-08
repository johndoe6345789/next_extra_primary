import React from 'react'

/**
 * Divider inset/margin variant
 */
export type DividerVariant =
  | 'fullBleed'
  | 'inset'
  | 'insetStart'
  | 'insetEnd'
  | 'insetBoth'
  | 'middle'

/**
 * Text alignment for dividers with text content
 */
export type DividerTextAlign =
  | 'start'
  | 'center'
  | 'end'

/**
 * Props for the Divider component
 */
export interface DividerProps
  extends React.HTMLAttributes<HTMLHRElement> {
  /** Render as vertical divider */
  vertical?: boolean
  /** Inset/margin variant */
  variant?: DividerVariant
  /** Thicker divider (2px instead of 1px) */
  thick?: boolean
  /** Lighter color variant */
  light?: boolean
  /** Darker color variant */
  dark?: boolean
  /** Use flexItem margins */
  flexItem?: boolean
  /** Section divider style */
  section?: boolean
  /** Text content for divider with text */
  children?: React.ReactNode
  /** Text alignment when children provided */
  textAlign?: DividerTextAlign
  /** Test ID for automated testing */
  testId?: string
  /** MUI sx prop for styling */
  sx?: Record<string, unknown>
}
