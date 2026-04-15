'use client'

/**
 * MarkdownPreview — renders a very small
 * markdown subset in the right pane of the
 * editor.  Builds a React element tree (no
 * raw HTML injection) to stay safe.
 */

import { useMemo, type ReactNode } from 'react'

export interface MarkdownPreviewProps {
  /** Raw markdown text from the editor. */
  source: string
}

/** Parse one line into plain text (no inline). */
function renderLine(
  line: string,
  key: number,
): ReactNode {
  const m = /^(#{1,6}) (.*)$/.exec(line)
  if (m) {
    const n = m[1].length
    const Tag = ('h' + n) as keyof JSX.IntrinsicElements
    return <Tag key={key}>{m[2]}</Tag>
  }
  if (line.trim() === '') return null
  if (line.startsWith('- ')) {
    return <li key={key}>{line.slice(2)}</li>
  }
  return <p key={key}>{line}</p>
}

function renderAll(src: string): ReactNode[] {
  return src.split(/\n/).map(renderLine)
}

export function MarkdownPreview(
  { source }: MarkdownPreviewProps,
) {
  const nodes = useMemo(
    () => renderAll(source), [source],
  )
  return (
    <article
      data-testid="markdown-preview"
      aria-label="Rendered preview"
    >
      {nodes}
    </article>
  )
}
