/**
 * Type definitions for Accordion components.
 */
import type React from 'react'

/** Visual variant for the accordion */
export type AccordionVariant =
  | 'elevated'
  | 'outlined'
  | 'filled'

/** Props for the Accordion root */
export interface AccordionProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onChange'
  > {
  children?: React.ReactNode
  expanded?: boolean
  defaultExpanded?: boolean
  onChange?: (
    event: React.SyntheticEvent,
    expanded: boolean,
  ) => void
  disabled?: boolean
  variant?: AccordionVariant
  disableGutters?: boolean
  square?: boolean
  testId?: string
}

/** Props for the clickable summary header */
export interface AccordionSummaryProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onClick'
  > {
  children?: React.ReactNode
  expandIcon?: React.ReactNode
  leadingIcon?: React.ReactNode
  iconClassName?: string
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void
}

/** Props for the expandable details section */
export interface AccordionDetailsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  padded?: boolean
}

/** Props for the actions row */
export interface AccordionActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  disableSpacing?: boolean
}

/** Props for a group of accordions */
export interface AccordionGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  flush?: boolean
}

/** Props for the expand icon SVG */
export interface ExpandMoreIconProps
  extends React.SVGProps<SVGSVGElement> {}
