'use client'

/**
 * ResultsChart — horizontal bar chart of a
 * poll's tally, rendered with M3 tokens via
 * the .polls-bar-row SCSS atom.  Takes the
 * TallyResult from usePolls() and paints
 * one row per option, normalising the fill
 * width against the max score.
 */

import { Typography } from '@shared/m3'
import type {
  TallyResult,
} from '@/hooks/usePolls'

export interface ResultsChartProps {
  tally: TallyResult | null
}

export function ResultsChart({
  tally,
}: ResultsChartProps) {
  if (!tally) {
    return (
      <div
        className="polls-card"
        data-testid="results-empty"
        aria-label="No poll selected"
      >
        <Typography variant="body1">
          Select a poll to see results.
        </Typography>
      </div>
    )
  }

  const max = Math.max(
    1,
    ...tally.items.map(i => i.score),
  )

  return (
    <section
      className="polls-card"
      data-testid="results-chart"
      aria-label={
        `Results for poll ${tally.poll_id}`
      }
    >
      <Typography variant="titleMedium">
        {`${tally.kind} · `}
        {`${tally.total_votes} vote(s)`}
      </Typography>
      {tally.items.map(i => {
        const pct = Math.round(
          (i.score / max) * 100,
        )
        return (
          <div
            key={i.option_id}
            className="polls-bar-row"
            data-testid={
              `bar-${i.option_id}`
            }
          >
            <span className="label">
              {i.label}
            </span>
            <span className="bar">
              <span
                className="fill"
                style={{ width: `${pct}%` }}
              />
            </span>
            <span className="value">
              {i.score.toFixed(1)}
            </span>
          </div>
        )
      })}
    </section>
  )
}
