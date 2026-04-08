'use client'

import type { ReactNode } from 'react'
import type { ViewMode } from './SplitView'

/** Props for the SplitViewPanels renderer. */
export interface SplitViewPanelsProps {
  mode: ViewMode
  leftPanel: ReactNode
  rightPanel: ReactNode
  height: string
  leftLabel: string
  rightLabel: string
}

const BG_STYLE = {
  backgroundColor:
    'var(--mat-sys-surface, hsl(var(--background)))',
}

/**
 * Inner panel region of SplitView, renders
 * left, right, or both panels side-by-side.
 */
export function SplitViewPanels({
  mode, leftPanel, rightPanel,
  height, leftLabel, rightLabel,
}: SplitViewPanelsProps) {
  const regionLabel =
    mode === 'left'
      ? leftLabel
      : mode === 'right'
        ? rightLabel
        : `${leftLabel} and ${rightLabel}`

  return (
    <div
      className="rounded-md overflow-hidden border"
      style={{
        height,
        borderColor:
          'var(--mat-sys-outline-variant, hsl(var(--border)))',
        ...BG_STYLE,
      }}
      data-testid={`split-view-${mode}`}
      role="region"
      aria-label={regionLabel}
    >
      {mode === 'left' && leftPanel}
      {mode === 'right' && rightPanel}
      {mode === 'split' && (
        <div
          className="grid grid-cols-2 h-full"
          style={{
            gap: '1px',
            backgroundColor:
              'var(--mat-sys-outline-variant, hsl(var(--border)))',
          }}
          data-testid="split-view-grid"
        >
          <div
            className="overflow-auto"
            style={BG_STYLE}
            data-testid="split-view-left-pane"
          >
            {leftPanel}
          </div>
          <div
            className="overflow-auto"
            style={BG_STYLE}
            data-testid="split-view-right-pane"
          >
            {rightPanel}
          </div>
        </div>
      )}
    </div>
  )
}
