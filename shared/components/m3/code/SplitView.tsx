'use client'

import { useState, type ReactNode } from 'react'
import { SplitViewModeSelector }
  from './SplitViewModeSelector'
import { SplitViewPanels }
  from './SplitViewPanels'

export type ViewMode = 'split' | 'left' | 'right'

export interface SplitViewProps {
  leftPanel: ReactNode
  rightPanel: ReactNode
  height?: string
  defaultMode?: ViewMode
  leftLabel?: string
  rightLabel?: string
  leftButtonLabel?: string
  rightButtonLabel?: string
  splitButtonLabel?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  splitIcon?: ReactNode
  mode?: ViewMode
  onModeChange?: (mode: ViewMode) => void
  hideControls?: boolean
  className?: string
  testId?: string
}

/**
 * Split view component for displaying two
 * panels side by side with mode switching.
 */
export function SplitView({
  leftPanel, rightPanel,
  height = '500px',
  defaultMode = 'split',
  leftLabel = 'Left panel',
  rightLabel = 'Right panel',
  leftButtonLabel = 'Left',
  rightButtonLabel = 'Right',
  splitButtonLabel = 'Split',
  leftIcon, rightIcon, splitIcon,
  mode: controlledMode, onModeChange,
  hideControls = false,
  className = '', testId,
}: SplitViewProps) {
  const [internalMode, setInternalMode] =
    useState<ViewMode>(defaultMode)
  const mode = controlledMode ?? internalMode
  const setMode = (m: ViewMode) =>
    onModeChange
      ? onModeChange(m)
      : setInternalMode(m)

  return (
    <div
      className={
        `flex flex-col gap-3 ${className}`
      }
      data-testid={testId ?? 'split-view'}
    >
      {!hideControls && (
        <SplitViewModeSelector
          mode={mode} onModeChange={setMode}
          leftLabel={leftLabel}
          rightLabel={rightLabel}
          leftButtonLabel={leftButtonLabel}
          rightButtonLabel={rightButtonLabel}
          splitButtonLabel={splitButtonLabel}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          splitIcon={splitIcon} />
      )}
      <SplitViewPanels
        mode={mode}
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        height={height}
        leftLabel={leftLabel}
        rightLabel={rightLabel} />
    </div>
  )
}
