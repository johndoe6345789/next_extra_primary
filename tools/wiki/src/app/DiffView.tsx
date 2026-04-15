'use client'

/**
 * DiffView — renders a list of diff ops with
 * colour coding per op type.
 */

import type { DiffOp } from '@/hooks/useRevisions'

interface Props {
  diff: DiffOp[]
}

export default function DiffView({ diff }: Props) {
  if (diff.length === 0) {
    return (
      <section
        className="wiki-diff"
        data-testid="wiki-diff-empty"
        aria-label="No diff selected"
      >
        <p>
          Pick two revisions to see a diff.
        </p>
      </section>
    )
  }
  return (
    <section
      className="wiki-diff"
      data-testid="wiki-diff"
      aria-label="Revision diff"
    >
      {diff.map((op, i) => (
        <div
          key={i}
          className="line"
          data-op={op.op}
        >
          {op.op} {op.line}
        </div>
      ))}
    </section>
  )
}
