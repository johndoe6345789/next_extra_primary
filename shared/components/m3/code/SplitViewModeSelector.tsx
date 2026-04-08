'use client'

import { type ReactNode } from 'react'
import { SplitViewModeButton }
  from './SplitViewModeButton'
import type { ViewMode } from './SplitView'

export interface SplitViewModeSelectorProps {
  mode: ViewMode
  onModeChange: (mode: ViewMode) => void
  leftLabel: string
  rightLabel: string
  leftButtonLabel: string
  rightButtonLabel: string
  splitButtonLabel: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  splitIcon?: ReactNode
}

/**
 * Mode selector button group for SplitView.
 */
export function SplitViewModeSelector({
  mode, onModeChange,
  leftLabel, rightLabel,
  leftButtonLabel, rightButtonLabel,
  splitButtonLabel,
  leftIcon, rightIcon, splitIcon,
}: SplitViewModeSelectorProps) {
  return (
    <div className="flex items-center justify-end">
      <div
        className="flex items-center gap-1 p-1 rounded-md"
        style={{
          backgroundColor:
            'var(--mat-sys-surface-variant, hsl(var(--muted)))',
        }}
        role="group"
        aria-label="View mode selector">
        <SplitViewModeButton
          isActive={mode === 'left'}
          onClick={() => onModeChange('left')}
          icon={leftIcon}
          label={leftButtonLabel}
          ariaLabel={`Show ${leftLabel} only`}
          testId="view-mode-left-btn" />
        <SplitViewModeButton
          isActive={mode === 'split'}
          onClick={() => onModeChange('split')}
          icon={splitIcon}
          label={splitButtonLabel}
          ariaLabel={`Show ${leftLabel} and ${rightLabel}`}
          testId="view-mode-split-btn" />
        <SplitViewModeButton
          isActive={mode === 'right'}
          onClick={() => onModeChange('right')}
          icon={rightIcon}
          label={rightButtonLabel}
          ariaLabel={`Show ${rightLabel} only`}
          testId="view-mode-right-btn" />
      </div>
    </div>
  )
}

export default SplitViewModeSelector;
