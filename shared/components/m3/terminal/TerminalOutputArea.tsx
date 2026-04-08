'use client'

import { useRef, useEffect, type FormEvent }
  from 'react'
import { TerminalOutput, type TerminalLine }
  from './TerminalOutput'
import { TerminalInput } from './TerminalInput'

export interface TerminalOutputAreaProps {
  lines: TerminalLine[]
  isRunning: boolean
  emptyMessage: string
  autoScroll: boolean
  waitingForInput: boolean
  inputValue: string
  inputPlaceholder: string
  onInputChange?: (value: string) => void
  onInputSubmit?: (e: FormEvent) => void
}

/**
 * Scrollable output area with optional input
 * field at the bottom.
 */
export function TerminalOutputArea({
  lines, isRunning, emptyMessage,
  autoScroll, waitingForInput,
  inputValue, inputPlaceholder,
  onInputChange, onInputSubmit,
}: TerminalOutputAreaProps) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (autoScroll) {
      endRef.current?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }, [lines, autoScroll])

  return (
    <div
      className="flex-1 overflow-auto p-4 font-mono text-sm bg-background/50"
      data-testid="terminal-output-area"
      role="region"
      aria-label="Terminal output"
      aria-live="polite" aria-atomic="false">
      <TerminalOutput lines={lines}
        isRunning={isRunning}
        emptyMessage={emptyMessage} />
      {onInputChange && onInputSubmit && (
        <TerminalInput
          waitingForInput={waitingForInput}
          inputValue={inputValue}
          onInputChange={onInputChange}
          onSubmit={onInputSubmit}
          placeholder={inputPlaceholder} />
      )}
      <div ref={endRef} />
    </div>
  )
}
