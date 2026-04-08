'use client'

/**
 * MarkdownDisplay - renders basic markdown content
 * (headings, lists, paragraphs) as styled HTML.
 */

import { renderMarkdownLine } from './MarkdownRenderer'

/** Props for MarkdownDisplay */
export interface MarkdownDisplayProps {
  /** Markdown content to render */
  content: string
  /** Custom className */
  className?: string
  /** Aria label for the region */
  ariaLabel?: string
  /** Disable animations */
  disableAnimations?: boolean
  /** Wrapper element type */
  wrapper?: 'div' | 'article' | 'section'
  /** Test ID for testing */
  testId?: string
}

/**
 * Renders simple markdown content inside a
 * styled card region.
 */
export function MarkdownDisplay({
  content,
  className = '',
  ariaLabel = 'Content',
  disableAnimations = false,
  wrapper: Wrapper = 'div',
  testId,
}: MarkdownDisplayProps) {
  const anim = disableAnimations
    ? ''
    : 'animate-fadeIn'

  return (
    <Wrapper
      className={`prose prose-invert prose-sm max-w-none ${anim} ${className}`}
      data-testid={testId ?? 'markdown-display'}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="bg-card/50 rounded-lg p-4 border border-border space-y-3">
        {content.split('\n').map(renderMarkdownLine)}
      </div>
    </Wrapper>
  )
}
