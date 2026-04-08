/**
 * Type definitions for Stepper components.
 */
import type React from 'react'

/** Props for the Stepper container */
export interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  activeStep?: number
  orientation?: 'horizontal' | 'vertical'
  alternativeLabel?: boolean
  nonLinear?: boolean
  connector?: React.ReactNode
  /** Test ID for automated testing */
  testId?: string
}

/** Props for an individual Step */
export interface StepProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  active?: boolean
  completed?: boolean
  disabled?: boolean
  expanded?: boolean
  index?: number
  last?: boolean
}

/** Props for the step label */
export interface StepLabelProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode
  icon?: React.ReactNode | false
  optional?: React.ReactNode
  error?: boolean
  StepIconComponent?: React.ComponentType<
    Record<string, unknown>
  >
  StepIconProps?: Record<string, unknown>
}

/** Props for an interactive step button */
export interface StepButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  icon?: React.ReactNode
  optional?: React.ReactNode
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void
  disabled?: boolean
}

/** Props for the step content area */
export interface StepContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  TransitionComponent?: React.ComponentType<
    Record<string, unknown>
  >
  TransitionProps?: Record<string, unknown>
  transitionDuration?: number | string
}

/** Props for the step connector line */
export interface StepConnectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  completed?: boolean
}

/** Props for the step icon */
export interface StepIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean
  completed?: boolean
  error?: boolean
  icon?: React.ReactNode
}
