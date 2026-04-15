'use client'

/**
 * Polls operator root page — 2-column
 * layout: editor + poll list on the left,
 * results chart on the right.  All state
 * lives in hooks so this file stays under
 * the 100-LOC cap.
 */

import { usePolls } from '@/hooks/usePolls'
import {
  usePollActions,
} from '@/hooks/usePollActions'
import { PollList } from './PollList'
import { PollEditor } from './PollEditor'
import { ResultsChart } from './ResultsChart'

export default function PollsPage() {
  const {
    items, selected, tally, refresh, loadTally,
  } = usePolls()
  const { create } = usePollActions(refresh)

  return (
    <main className="polls-shell">
      <h1>Polls</h1>
      <div className="polls-grid">
        <div>
          <PollEditor onCreate={create} />
          <PollList
            rows={items}
            selected={selected}
            onSelect={loadTally}
          />
        </div>
        <ResultsChart tally={tally} />
      </div>
    </main>
  )
}
