'use client'

import type { ReactNode } from 'react'
import { Button } from '../inputs/Button'

export interface SplitViewModeButtonProps {
  isActive: boolean
  onClick: () => void
  icon?: ReactNode
  label: string
  ariaLabel: string
  testId: string
}

/**
 * Single mode toggle button for the split
 * view selector group.
 */
export function SplitViewModeButton({
  isActive, onClick,
  icon, label, ariaLabel, testId,
}: SplitViewModeButtonProps) {
  return (
    <Button
      variant={isActive ? 'filled' : 'text'}
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 h-8"
      data-testid={testId}
      aria-label={ariaLabel}
      aria-pressed={isActive}
    >
      {icon}
      <span className="hidden sm:inline">
        {label}
      </span>
    </Button>
  )
}
