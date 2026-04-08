/** A single terminal output line. */
export interface TerminalLine {
  type:
    | 'output'
    | 'error'
    | 'input-prompt'
    | 'input-value'
    | 'info'
    | 'warning'
  content: string
  id: string
}

/** Props for the TerminalOutput component. */
export interface TerminalOutputProps {
  lines: TerminalLine[]
  isRunning?: boolean
  emptyMessage?: string
  className?: string
  disableAnimations?: boolean
  testId?: string
}
