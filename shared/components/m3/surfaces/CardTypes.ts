/**
 * Type definitions for Card components.
 */
import type React from 'react'

/** Props for the Card container */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  clickable?: boolean
  raised?: boolean
  variant?:
    | 'elevation'
    | 'elevated'
    | 'outlined'
    | 'filled'
  sx?: Record<string, unknown>
}

/** Props for the card header */
export interface CardHeaderProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'title'
  > {
  title?: React.ReactNode
  subheader?: React.ReactNode
  action?: React.ReactNode
  avatar?: React.ReactNode
}

/** Props for the card content area */
export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  sx?: Record<string, unknown>
}

/** Props for the card actions row */
export interface CardActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  disableSpacing?: boolean
  sx?: Record<string, unknown>
}

/** Props for the clickable action area */
export interface CardActionAreaProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  sx?: Record<string, unknown>
  component?: React.ElementType
  href?: string
}

/** Props for the card media section */
export interface CardMediaProps
  extends React.HTMLAttributes<HTMLDivElement> {
  image?: string
  alt?: string
  height?: string | number
  component?: 'div' | 'img'
  sx?: Record<string, unknown>
}

/** Props for the card title */
export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode
  text?: string
}

/** Props for the card description */
export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
  text?: string
}

/** Props for the card footer */
export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

/** Props for the card title group */
export interface CardTitleGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}
