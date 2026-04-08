'use client'

import { type ReactNode } from 'react'
import { Button } from '../inputs/Button'

export interface TerminalRunButtonProps {
  onRun: () => void
  isDisabled: boolean
  isRunning: boolean
  isInitializing: boolean
  runLabel: string
  runningLabel: string
  initializingLabel: string
  runIcon?: ReactNode
}

/**
 * Run/loading button for the terminal header.
 */
export function TerminalRunButton({
  onRun,
  isDisabled,
  isRunning,
  isInitializing,
  runLabel,
  runningLabel,
  initializingLabel,
  runIcon,
}: TerminalRunButtonProps) {
  const ariaLabel = isRunning
    ? 'Running code'
    : isInitializing
      ? 'Loading terminal'
      : `${runLabel} code`

  return (
    <Button
      onClick={onRun}
      disabled={isDisabled}
      size="sm"
      className="gap-2"
      data-testid="run-terminal-btn"
      aria-label={ariaLabel}
      aria-busy={isRunning || isInitializing}
    >
      {isRunning || isInitializing ? (
        <>
          <span
            className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            aria-hidden="true"
          />
          {isInitializing
            ? initializingLabel
            : runningLabel}
        </>
      ) : (
        <>
          {runIcon}
          {runLabel}
        </>
      )}
    </Button>
  )
}
