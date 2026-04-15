'use client'

/**
 * RevisionList — lists wiki page revisions and
 * lets the user pick two to diff.
 */

import { useState } from 'react'
import type { Revision } from '@/hooks/useRevisions'

interface Props {
  revisions: Revision[]
  onDiff: (from: number, to: number) => void
}

export default function RevisionList({
  revisions, onDiff,
}: Props) {
  const [from, setFrom] = useState<number | null>(
    null,
  )
  const [to, setTo] = useState<number | null>(null)

  const pick = (rev: number) => {
    if (from === null) {
      setFrom(rev)
      return
    }
    if (to === null && rev !== from) {
      setTo(rev)
      onDiff(Math.min(from, rev),
             Math.max(from, rev))
      return
    }
    setFrom(rev)
    setTo(null)
  }

  return (
    <section
      className="wiki-revisions"
      data-testid="wiki-revisions"
      aria-label="Revision history"
    >
      <h3>History</h3>
      <ul>
        {revisions.map((r) => (
          <li key={r.rev}>
            <button
              type="button"
              aria-label={`Rev ${r.rev}`}
              data-testid={
                `wiki-rev-${r.rev}`}
              data-selected={
                r.rev === from || r.rev === to
                  ? 'true'
                  : 'false'}
              onClick={() => pick(r.rev)}
            >
              r{r.rev} — {r.at}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
