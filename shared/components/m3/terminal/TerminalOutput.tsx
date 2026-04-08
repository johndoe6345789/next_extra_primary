'use client'

import { TerminalLineRenderer }
  from './TerminalLineRenderer'
import type {
  TerminalOutputProps,
} from './terminalOutputTypes'

export type {
  TerminalLine, TerminalOutputProps,
} from './terminalOutputTypes'

/**
 * Terminal output display with support for
 * different line types and error alerts.
 */
export function TerminalOutput({
  lines, isRunning = false,
  emptyMessage = 'No output yet',
  className = '', disableAnimations = false,
  testId,
}: TerminalOutputProps) {
  if (lines.length === 0 && !isRunning) {
    return (
      <div className={
        `flex items-center justify-center h-full text-muted-foreground ${className}`
      }
        data-testid={
          testId ?? 'terminal-empty-state'
        }
        role="status" aria-live="polite"
        aria-label="Terminal output area">
        {emptyMessage}
      </div>
    )
  }
  const hasErrors = lines.some(
    (l) => l.type === 'error')
  const lastError = [...lines]
    .reverse()
    .find((l) => l.type === 'error')
  return (
    <div className={
      `space-y-1 ${className}`
    }
      data-testid={
        testId ?? 'terminal-output-content'
      }
      aria-label="Terminal output area"
      role="log">
      {hasErrors && (
        <div className="sr-only"
          role="alert" aria-live="assertive"
          aria-atomic="true"
          data-testid="terminal-error-alert">
          Error: {lastError?.content}
        </div>
      )}
      {lines.map((line, idx) => (
        <TerminalLineRenderer
          key={line.id} line={line}
          index={idx}
          disableAnimations={
            disableAnimations
          } />
      ))}
    </div>
  )
}
