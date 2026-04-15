'use client'

/**
 * StreamCard — single row in the live list.
 * Shows slug, status, ingest URL and the
 * three admin actions (kick, block, delete).
 */

import type { StreamRow } from '@/hooks/useStreams'

interface Props {
  row: StreamRow
  onBlock: (id: number) => void
  onKick: (id: number) => void
  onRemove: (id: number) => void
}

export function StreamCard({
  row,
  onBlock,
  onKick,
  onRemove,
}: Props) {
  const live = row.status === 'live'
  const url =
    `rtsp://localhost:8554/${row.ingest_key}`
  return (
    <article
      className="stream-card"
      role="listitem"
      aria-label={`Stream ${row.slug}`}
      data-testid={`stream-${row.id}`}
    >
      <header>
        <strong>{row.title}</strong>
        <span
          className={`badge${
            live ? ' live' : ''
          }`}
        >
          {row.status}
        </span>
      </header>
      <div>{row.slug}</div>
      <code>{url}</code>
      <div className="stream-actions">
        <button
          type="button"
          data-testid="kick"
          onClick={() => onKick(row.id)}
          aria-label="Kick publisher"
        >
          Kick
        </button>
        <button
          type="button"
          data-testid="block"
          onClick={() => onBlock(row.id)}
          aria-label="Block stream"
        >
          Block
        </button>
        <button
          type="button"
          data-testid="remove"
          onClick={() => onRemove(row.id)}
          aria-label="Delete stream"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
