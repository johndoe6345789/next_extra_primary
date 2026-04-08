'use client'

/**
 * renderMarkdownLine - converts a single line of
 * simple markdown into a React node.
 */

import type { ReactNode } from 'react'

/**
 * Render a single markdown line as a heading,
 * list item, or paragraph.
 */
export function renderMarkdownLine(
  line: string,
  idx: number,
): ReactNode {
  if (line.startsWith('###')) {
    return (
      <h3
        key={idx}
        className="text-base font-semibold text-foreground mt-4 mb-2"
      >
        {line.replace('###', '').trim()}
      </h3>
    )
  }
  if (line.startsWith('##')) {
    return (
      <h2
        key={idx}
        className="text-lg font-semibold text-foreground mt-4 mb-2"
      >
        {line.replace('##', '').trim()}
      </h2>
    )
  }
  if (line.startsWith('#')) {
    return (
      <h1
        key={idx}
        className="text-xl font-bold text-foreground mt-4 mb-2"
      >
        {line.replace('#', '').trim()}
      </h1>
    )
  }
  if (line.match(/^\d+\./)) {
    return (
      <div key={idx} className="text-foreground/90 ml-2">
        {line}
      </div>
    )
  }
  if (line.startsWith('-') || line.startsWith('*')) {
    return (
      <div key={idx} className="text-foreground/90 ml-4">
        {line}
      </div>
    )
  }
  if (line.trim()) {
    return (
      <p
        key={idx}
        className="text-foreground/80 text-sm leading-relaxed"
      >
        {line}
      </p>
    )
  }
  return null
}
