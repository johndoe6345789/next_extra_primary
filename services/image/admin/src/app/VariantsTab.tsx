'use client'

/**
 * VariantsTab — preview grid of produced
 * variants for the currently selected job.
 */

import { Typography } from '@shared/m3'
import { useVariants } from '@/hooks/useVariants'

interface VariantsTabProps {
  jobId: number | null
}

export function VariantsTab({
  jobId,
}: VariantsTabProps) {
  const { items } = useVariants(jobId)

  if (jobId === null)
    return (
      <Typography variant="body2">
        Select a job from the Jobs tab.
      </Typography>
    )

  if (items.length === 0)
    return (
      <Typography variant="body2">
        No variants yet for job {jobId}.
      </Typography>
    )

  return (
    <section
      className="img-grid"
      data-testid="variants-grid"
      aria-label="Variant preview grid"
    >
      {items.map((v) => (
        <article
          key={v.name}
          className="img-card"
          data-testid={`variant-${v.name}`}
        >
          <Typography variant="subtitle1">
            {v.name}
          </Typography>
          <Typography variant="body2">
            {v.width}×{v.height} {v.format}
          </Typography>
          <Typography variant="caption">
            {v.bytes} bytes
          </Typography>
        </article>
      ))}
    </section>
  )
}
