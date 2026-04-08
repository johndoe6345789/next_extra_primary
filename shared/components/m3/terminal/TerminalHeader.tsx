'use client'

import { type ReactNode } from 'react'
import { TerminalRunButton } from './TerminalRunButton'

export interface TerminalHeaderProps {
  onRun: () => void
  isRunning?: boolean
  isInitializing?: boolean
  waitingForInput?: boolean
  title?: string
  titleIcon?: ReactNode
  runLabel?: string
  runningLabel?: string
  initializingLabel?: string
  runIcon?: ReactNode
  className?: string
  actions?: ReactNode
  testId?: string
}

/**
 * Terminal header with title and run button.
 */
export function TerminalHeader({
  onRun,
  isRunning = false,
  isInitializing = false,
  waitingForInput = false,
  title = 'Terminal',
  titleIcon,
  runLabel = 'Run',
  runningLabel = 'Running...',
  initializingLabel = 'Loading...',
  runIcon,
  className = '',
  actions,
  testId,
}: TerminalHeaderProps) {
  const isDisabled =
    isRunning ||
    isInitializing ||
    waitingForInput

  return (
    <div
      className={`flex items-center justify-between p-4 border-b border-border bg-muted/30 ${className}`}
      data-testid={testId ?? 'terminal-header'}
    >
      <div className="flex items-center gap-2">
        {titleIcon}
        <h3 className="text-sm font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <TerminalRunButton
          onRun={onRun}
          isDisabled={isDisabled}
          isRunning={isRunning}
          isInitializing={isInitializing}
          runLabel={runLabel}
          runningLabel={runningLabel}
          initializingLabel={initializingLabel}
          runIcon={runIcon}
        />
      </div>
    </div>
  )
}
