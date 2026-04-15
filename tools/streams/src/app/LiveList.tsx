'use client'

/**
 * LiveList — grid of StreamCard elements.
 * Rendering each row lives in StreamCard
 * so this file stays comfortably under
 * the 100-LOC cap.
 */

import type { StreamRow } from '@/hooks/useStreams'
import { StreamCard } from './StreamCard'

interface Props {
  rows: StreamRow[]
  onBlock: (id: number) => void
  onKick: (id: number) => void
  onRemove: (id: number) => void
}

export function LiveList({
  rows,
  onBlock,
  onKick,
  onRemove,
}: Props) {
  if (rows.length === 0) {
    return (
      <p data-testid="empty">
        No streams yet — create one via
        POST /api/streams.
      </p>
    )
  }
  return (
    <div
      className="stream-grid"
      role="list"
      aria-label="Live streams"
      data-testid="stream-grid"
    >
      {rows.map((r) => (
        <StreamCard
          key={r.id}
          row={r}
          onBlock={onBlock}
          onKick={onKick}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
