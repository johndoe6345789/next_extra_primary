'use client'

import type { ReactNode, FormEvent } from 'react'
import { TerminalHeader } from './TerminalHeader'
import type { TerminalLine }
  from './TerminalOutput'
import { TerminalStatus }
  from './TerminalStatus'
import { TerminalOutputArea }
  from './TerminalOutputArea'

export interface TerminalProps {
  lines: TerminalLine[]
  isRunning?: boolean
  isInitializing?: boolean
  waitingForInput?: boolean
  inputValue?: string
  onInputChange?: (value: string) => void
  onInputSubmit?: (e: FormEvent) => void
  onRun?: () => void
  title?: string
  titleIcon?: ReactNode
  runLabel?: string
  emptyMessage?: string
  inputPlaceholder?: string
  runIcon?: ReactNode
  className?: string
  autoScroll?: boolean
  hideHeader?: boolean
  headerActions?: ReactNode
  testId?: string
}

/**
 * Complete terminal component with header,
 * output, input, and status announcer.
 */
export function Terminal({
  lines, isRunning = false,
  isInitializing = false,
  waitingForInput = false,
  inputValue = '', onInputChange,
  onInputSubmit, onRun,
  title = 'Terminal', titleIcon,
  runLabel = 'Run',
  emptyMessage = 'Click "Run" to execute code',
  inputPlaceholder = 'Enter input...',
  runIcon, className = '',
  autoScroll = true, hideHeader = false,
  headerActions, testId,
}: TerminalProps) {
  return (
    <div
      className={
        `flex flex-col h-full bg-card ${className}`}
      data-testid={testId ?? 'terminal'}
      role="region" aria-label="Terminal">
      {!hideHeader && onRun && (
        <TerminalHeader onRun={onRun}
          isRunning={isRunning}
          isInitializing={isInitializing}
          waitingForInput={waitingForInput}
          title={title} titleIcon={titleIcon}
          runLabel={runLabel} runIcon={runIcon}
          actions={headerActions} />
      )}
      <TerminalStatus lines={lines}
        isRunning={isRunning}
        isInitializing={isInitializing}
        waitingForInput={waitingForInput} />
      <TerminalOutputArea lines={lines}
        isRunning={isRunning}
        emptyMessage={emptyMessage}
        autoScroll={autoScroll}
        waitingForInput={waitingForInput}
        inputValue={inputValue}
        inputPlaceholder={inputPlaceholder}
        onInputChange={onInputChange}
        onInputSubmit={onInputSubmit} />
    </div>
  )
}

export type { TerminalLine }
  from './TerminalOutput'
