'use client'

import type { TerminalLine } from './TerminalOutput'

export interface TerminalLineRendererProps {
  line: TerminalLine
  index: number
  disableAnimations: boolean
}

/**
 * Renders a single terminal line with
 * type-specific styling and animation.
 */
export function TerminalLineRenderer({
  line,
  index,
  disableAnimations,
}: TerminalLineRendererProps) {
  const animClass = disableAnimations
    ? ''
    : 'animate-fadeIn'
  const animStyle = disableAnimations
    ? {}
    : { animationDelay: `${index * 50}ms` }

  return (
    <div
      className={`leading-relaxed ${animClass}`}
      style={animStyle}
      role={
        line.type === 'error' ? 'alert' : 'status'
      }
      aria-live={
        line.type === 'error' ? 'assertive' : 'off'
      }
    >
      {line.type === 'output' && (
        <div className="text-foreground whitespace-pre-wrap">
          {line.content}
        </div>
      )}
      {line.type === 'error' && (
        <div
          className="text-destructive whitespace-pre-wrap"
          aria-label={`Error: ${line.content}`}
        >
          {line.content}
        </div>
      )}
      {line.type === 'warning' && (
        <div className="text-yellow-500 whitespace-pre-wrap">
          {line.content}
        </div>
      )}
      {line.type === 'info' && (
        <div className="text-blue-500 whitespace-pre-wrap">
          {line.content}
        </div>
      )}
      {line.type === 'input-prompt' && (
        <div className="text-accent font-medium whitespace-pre-wrap">
          {line.content}
        </div>
      )}
      {line.type === 'input-value' && (
        <div className="text-primary whitespace-pre-wrap">
          {'> ' + line.content}
        </div>
      )}
    </div>
  )
}
