'use client'

import type { TerminalLine } from './TerminalOutput'

export interface TerminalStatusProps {
  lines: TerminalLine[]
  isRunning: boolean
  isInitializing: boolean
  waitingForInput: boolean
}

/**
 * Screen-reader status region announcing
 * terminal state changes.
 */
export function TerminalStatus({
  lines,
  isRunning,
  isInitializing,
  waitingForInput,
}: TerminalStatusProps) {
  const hasErrors = lines.some(
    (line) => line.type === 'error'
  )

  return (
    <div
      className="sr-only"
      role="status"
      aria-live={
        hasErrors ? 'assertive' : 'polite'
      }
      aria-atomic="true"
      data-testid="terminal-status"
    >
      {isRunning && 'Code is running'}
      {isInitializing &&
        'Terminal is initializing'}
      {waitingForInput &&
        'Waiting for user input'}
      {!isRunning &&
        !isInitializing &&
        lines.length > 0 &&
        `${lines.length} lines of output`}
      {hasErrors && 'Errors detected in output'}
    </div>
  )
}
