'use client'

/**
 * ErrorStackTrace - collapsible stack trace viewer.
 */

import React, { useState } from 'react'
import { Button } from '../inputs/Button'

/** Props for the stack trace toggle */
export interface ErrorStackTraceProps {
  /** Raw stack trace string */
  stack: string
}

/**
 * Renders a toggle button that reveals the
 * full error stack trace in a scrollable pre block.
 */
export function ErrorStackTrace({
  stack,
}: ErrorStackTraceProps) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-full justify-between"
        aria-expanded={open}
        data-testid="stack-trace-trigger"
      >
        {open ? 'Hide Stack Trace' : 'Show Stack Trace'}
      </Button>
      {open && (
        <div
          className="mt-4"
          data-testid="stack-trace-content"
        >
          <pre
            className="text-xs bg-destructive/10 p-3 rounded overflow-auto max-h-60"
            data-testid="error-stack-trace"
          >
            {stack}
          </pre>
        </div>
      )}
    </div>
  )
}
