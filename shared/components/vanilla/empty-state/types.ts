import type React from 'react'

/**
 * Props for the EmptyState component.
 */
export interface EmptyStateProps {
  /** Icon to display (emoji or component) */
  icon?: React.ReactNode | string
  /** Title text */
  title: string
  /** Description/message text */
  description: string
  /** Optional helpful hint or suggestion text */
  hint?: string
  /** Optional primary action button */
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
    loading?: boolean
  }
  /** Optional secondary action */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  /** CSS class name for custom styling */
  className?: string
  /** Custom style overrides */
  style?: React.CSSProperties
  /** Size variant */
  size?: 'compact' | 'normal' | 'large'
  /** Whether to animate on mount (fade-in) */
  animated?: boolean
}

/** Size mapping for EmptyState variants. */
export interface SizeConfig {
  padding: string
  iconSize: string
  titleSize: string
  descSize: string
}

/** Size map lookup. */
export const SIZE_MAP: Record<string, SizeConfig> = {
  compact: {
    padding: '20px 16px',
    iconSize: '32px',
    titleSize: '16px',
    descSize: '12px',
  },
  normal: {
    padding: '40px 20px',
    iconSize: '48px',
    titleSize: '20px',
    descSize: '14px',
  },
  large: {
    padding: '60px 20px',
    iconSize: '64px',
    titleSize: '24px',
    descSize: '16px',
  },
}
